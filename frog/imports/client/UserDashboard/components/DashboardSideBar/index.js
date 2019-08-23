// @flow
import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  ShowChart,
  Add,
  KeyboardArrowRight
} from '@material-ui/icons';
import { Sidebar, Panel } from '/imports/ui/Sidebar';
import { Logo } from '/imports/ui/Logo';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { RowButton, RowTitle } from '/imports/ui/RowItems';
import { TopBar } from '/imports/ui/TopBar';
import { Breadcrumb } from '/imports/ui/Breadcrumb';

type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[],
  callbackSessionsView: () => void,
  callbackDraftsView: () => void,
  callbackRecentsView: () => void,
  sessionsActive: boolean,
  draftsActive: boolean,
  recentsActive: boolean,
  history: RouterHistory,
  activePage: string
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
  children
}: DashBoardSideBarPropsT) => {
  return (
    <>
      <SidebarLayout
        sidebar={
          <Sidebar
            header={
              <>
                <Logo />
                <RowTitle> Dashboard </RowTitle>

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
              <RowButton
                onClick={callbackRecentsView}
                active={recentsActive}
                icon={<AccessTimeOutlined />}
                rightIcon={<KeyboardArrowRight fontSize="small" />}
              >
                Recents
              </RowButton>
              <RowButton
                icon={<Bookmark />}
                active={sessionsActive}
                onClick={callbackSessionsView}
                rightIcon={<KeyboardArrowRight fontSize="small" />}
              >
                Sessions
              </RowButton>
              <RowButton
                icon={<ShowChart />}
                active={draftsActive}
                onClick={callbackDraftsView}
                rightIcon={<KeyboardArrowRight fontSize="small" />}
              >
                Drafts
              </RowButton>
            </Panel>
          </Sidebar>
        }
        content={
          <>
            <TopBar navigation={<Breadcrumb paths={[activePage]} />} />

            {children}
          </>
        }
      />
    </>
  );
};
