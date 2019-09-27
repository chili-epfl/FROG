// @flow
import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  ShowChart,
  Add,
  KeyboardArrowRight,
  OpenInNew,
  MoreVert
} from '@material-ui/icons';
import DescriptionIcon from '@material-ui/icons/Description';
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
    backgroundColor: '#31bfae',
    color: '#FFFFFF',
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[],
  callbackSessionsView: () => void,
  callbackDraftsView: () => void,
  callbackTemplatesView: () => void,
  callbackRecentsView: () => void,
  sessionsActive: boolean,
  draftsActive: boolean,
  templatesActive: Boolean,
  recentsActive: boolean,
  activePage: string,
  history: any,
  showDrafts: boolean,
  showTemplates: boolean
};
export const DashboardSideBar = ({
  callbackRecentsView,
  callbackSessionsView,
  callbackDraftsView,
  callbackTemplatesView,
  sessionsActive,
  draftsActive,
  templatesActive,
  recentsActive,
  history,
  activePage,
  showDrafts,
  showTemplates,
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
          >
            <Panel>
              {showDrafts && (
                <>
                  <RowButton
                    onClick={callbackRecentsView}
                    active={recentsActive}
                    icon={<AccessTimeOutlined />}
                    rightIcon={<KeyboardArrowRight fontSize="small" />}
                  >
                    Recents
                  </RowButton>
                  <RowButton
                    icon={<ShowChart />}
                    active={draftsActive}
                    onClick={callbackDraftsView}
                    rightIcon={<KeyboardArrowRight fontSize="small" />}
                  >
                    Drafts
                  </RowButton>
                </>
              )}
              <RowButton
                icon={<Bookmark />}
                active={sessionsActive}
                onClick={callbackSessionsView}
                rightIcon={<KeyboardArrowRight fontSize="small" />}
              >
                Sessions
              </RowButton>
              {showTemplates && (
                <RowButton
                  icon={<DescriptionIcon />}
                  active={templatesActive}
                  onClick={callbackTemplatesView}
                  rightIcon={<KeyboardArrowRight fontSize="small" />}
                >
                  Templates
                </RowButton>
              )}
            </Panel>
          </Sidebar>
        }
        contentTopBar={
          <>
            <TopBarAccountsWrapper
              navigation={<Breadcrumb paths={[`${activePage}`]} />}
              actions={
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
