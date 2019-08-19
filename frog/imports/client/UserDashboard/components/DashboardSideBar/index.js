// @flow
import * as React from 'react';
import { AccessTimeOutlined, Bookmark, ShowChart } from '@material-ui/icons';
import { Sidebar, Panel } from '../../../../ui/Sidebar';
import { Logo } from '../../../../ui/Logo';
import { SidebarLayout } from '../../../../ui/Layout/SidebarLayout';
import { RowButton, RowTitle } from '../../../../ui/RowItems';
import { TopBar } from '../../../../ui/TopBar';
import { Breadcrumb } from '../../../../ui/Breadcrumb';

type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[],
  callbackSessionsView: () => void,
  callbackDraftsView: () => void,
  callbackRecentsView: () => void,
  sessionsActive: boolean,
  draftsActive: boolean,
  recentsActive: boolean
};
export const DashboardSideBar = ({
  callbackRecentsView,
  callbackSessionsView,
  callbackDraftsView,
  sessionsActive,
  draftsActive,
  recentsActive,
  history,
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
              </>
            }
            footer={
              <RowButton active onClick={() => history.push('/single')}>
                {' '}
                Create using Wizard{' '}
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
            <TopBar
              navigation={
                <Breadcrumb
                  icon={<AccessTimeOutlined fontSize="small" />}
                  paths={['Recents']}
                />
              }
            />

            {children}
          </>
        }
      />
    </>
  );
};
