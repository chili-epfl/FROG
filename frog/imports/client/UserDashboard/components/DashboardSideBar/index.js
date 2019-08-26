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
import { Button } from '/imports/ui/Button';

import { Sidebar, Panel } from '/imports/ui/Sidebar';
import { Logo } from '/imports/ui/Logo';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { RowButton, RowTitle } from '/imports/ui/RowItems';
import { TopBarAccountsWrapper } from '/imports/containers/TopBarWrapper';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { OverflowMenu } from '/imports/ui/OverflowMenu';

type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[],
  callbackSessionsView: () => void,
  callbackDraftsView: () => void,
  callbackRecentsView: () => void,
  sessionsActive: boolean,
  draftsActive: boolean,
  recentsActive: boolean,
  activePage: string,
  history: any,
  showDrafts: boolean
};
export const DashboardSideBar = ({
  callbackRecentsView,
  callbackSessionsView,
  callbackDraftsView,
  sessionsActive,
  draftsActive,
  recentsActive,
  history,
  activePage,
  showDrafts,
  children
}: DashBoardSideBarPropsT) => {
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
                  Create using Wizard
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
            </Panel>
          </Sidebar>
        }
        content={
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
            {children}
          </>
        }
      />
    </React.Fragment>
  );
};
