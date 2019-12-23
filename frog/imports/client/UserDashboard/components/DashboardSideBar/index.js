// @flow
import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  ShowChart,
  Add,
  KeyboardArrowRight,
  OpenInNew,
  MoreVert,
  AccountBox
} from '@material-ui/icons';
import DescriptionIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '/imports/ui/Button';
import Fab from '@material-ui/core/Fab';
import Autofix from '/imports/ui/Icons/Autofix';
import { Sidebar, Panel } from '/imports/ui/Sidebar';
import { Logo } from '/imports/ui/Logo';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { RowButton } from '/imports/ui/RowItems';
import { TopBarAccountsWrapper } from '/imports/containers/TopBarWrapper';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { OverflowMenu } from '/imports/ui/OverflowMenu';

const useStyles = makeStyles(theme => ({
  fab: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    transition: '.25s',
    '&:hover': {
      backgroundColor: theme.palette.primary.light
    }
  },
  panelMargin: {
    marginTop: theme.spacing(4)
  }
}));

type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[],
  callbackView: () => void,
  activePage: string,
  history: any,
  showSessions: boolean,
  showDrafts: boolean,
  showTemplates: boolean,
  showArchives: boolean,
  showAdmin: boolean
};
export const DashboardSideBar = ({
  callbackView,
  history,
  activePage,
  showSessions,
  showDrafts,
  showTemplates,
  showArchives,
  showAdmin,
  children
}: DashBoardSideBarPropsT) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <SidebarLayout
        sidebar={
          <Sidebar
            header={
              <>
                <Logo />

                <RowButton
                  size="large"
                  icon={<Add fontSize="small" />}
                  onClick={() => history.push('/wizard')}
                >
                  Create with Wizard
                </RowButton>
              </>
            }
            footer={
              showArchives && (
                <Panel>
                  <RowButton
                    active={activePage === 'Archives'}
                    icon={<ArchiveIcon />}
                    onClick={() => {
                      callbackView('Archives');
                    }}
                  >
                    Archive
                  </RowButton>
                </Panel>
              )
            }
          >
            <Panel>
              {showDrafts && (
                <>
                  <RowButton
                    onClick={() => {
                      callbackView('Recents');
                    }}
                    active={activePage === 'Recents'}
                    icon={<AccessTimeOutlined />}
                    rightIcon={<KeyboardArrowRight fontSize="small" />}
                  >
                    Recents
                  </RowButton>
                  <RowButton
                    icon={<ShowChart />}
                    active={activePage === 'Drafts'}
                    onClick={() => {
                      callbackView('Drafts');
                    }}
                    rightIcon={<KeyboardArrowRight fontSize="small" />}
                  >
                    Drafts
                  </RowButton>
                </>
              )}
              <RowButton
                icon={<Bookmark />}
                active={showSessions}
                onClick={() => {
                  callbackView('Sessions');
                }}
                rightIcon={<KeyboardArrowRight fontSize="small" />}
              >
                Sessions
              </RowButton>
              {showTemplates && (
                <RowButton
                  icon={<DescriptionIcon />}
                  active={activePage === 'Templates'}
                  onClick={() => {
                    callbackView('Templates');
                  }}
                  rightIcon={<KeyboardArrowRight fontSize="small" />}
                >
                  Templates
                </RowButton>
              )}
              {showAdmin && (
                <RowButton
                  icon={<AccountBox />}
                  active={activePage === 'Admin Control'}
                  onClick={() => {
                    callbackView('Admin Control');
                  }}
                  rightIcon={<KeyboardArrowRight fontSize="small" />}
                >
                  Admin Control
                </RowButton>
              )}
            </Panel>
          </Sidebar>
        }
        contentTopBar={
          <>
            <TopBarAccountsWrapper
              // $FlowFixMe
              navigation={<Breadcrumb paths={[`${activePage}`]} />}
              actions={
                // $FlowFixMe
                <OverflowMenu
                  button={
                    <Button
                      variant="minimal"
                      icon={<MoreVert fontSize="small" />}
                    />
                  }
                >
                  <RowButton
                    icon={<OpenInNew fontSize="small" />}
                    onClick={() => history.push('/teacher/graph/new')}
                  >
                    Advanced graph editor
                  </RowButton>
                  <RowButton
                    icon={<OpenInNew fontSize="small" />}
                    onClick={() => history.push('/teacher/preview')}
                  >
                    Advanced preview
                  </RowButton>
                </OverflowMenu>
              }
            />
          </>
        }
        content={<>{children}</>}
      />
      <Fab
        className={classes.fab}
        variant="extended"
        size="large"
        aria-label="delete"
        onClick={() => history.push('/wizard')}
      >
        <Autofix style={{ marginRight: '10px' }} />
        Create with wizard
      </Fab>
    </React.Fragment>
  );
};
