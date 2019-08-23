// @flow
import * as React from 'react';
import { AccessTimeOutlined, Bookmark, ShowChart } from '@material-ui/icons';
import { Sidebar, Panel } from '/imports/ui/Sidebar';
import { Logo } from '/imports/ui/Logo';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { RowButton, RowTitle } from '/imports/ui/RowItems';
import { TopBarAccountsWrapper } from '/imports/containers/TopBarWrapper';
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
    <React.Fragment>
      <SidebarLayout
        sidebar={
          <Sidebar
            header={
              <>
                <Logo />
                <RowTitle> Dashboard </RowTitle>
              </>
            }
            footer={
              <RowButton active onClick={() => history.push('/wizard')}>
                Create using Wizard
              </RowButton>
            }
          >
            <Panel>
              <RowButton
                onClick={callbackRecentsView}
                active={recentsActive}
                icon={<AccessTimeOutlined />}
              >
                Recents
              </RowButton>
              <RowButton
                icon={<Bookmark />}
                active={sessionsActive}
                onClick={callbackSessionsView}
              >
                Sessions
              </RowButton>
              <RowButton
                icon={<ShowChart />}
                active={draftsActive}
                onClick={callbackDraftsView}
              >
                Drafts
              </RowButton>
            </Panel>
          </Sidebar>
        }
        content={
          <>
            <TopBarAccountsWrapper
              navigation={<Breadcrumb paths={[`Dashboard/${activePage}`]} />}
              actions={<></>}
            />
            {children}
          </>
        }
      />
    </React.Fragment>
  );
};
