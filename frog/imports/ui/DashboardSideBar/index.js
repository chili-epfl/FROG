import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  ShowChart,
  ChromeReaderMode,
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { Sidebar, Panel } from '../Sidebar';
import { Logo } from '../Logo';
import { SidebarLayout } from '../Layout/SidebarLayout';
import { RowTitle } from '../RowItems/RowTitle';
import { RowButton } from '../RowItems/RowButton';
import { TopBar } from '../TopBar';
import { Breadcrumb } from '../Breadcrumb';



type DashBoardSideBarPropsT = {
  children: React.Node | React.Node[]
}
export const DashboardSideBar = ({children}: DashBoardSideBarPropsT) => {
    return (
      <>
        <SidebarLayout
          sidebar={
            <Sidebar
              header={
                <>
                  <Logo />
                  <Typography variant="h6"> Dashboard </Typography>
                </>
              }
              footer={<RowButton active> Create using Wizard </RowButton>}
            >
              <Panel>
                <RowButton active icon={<AccessTimeOutlined />}>
                  Recents
                </RowButton>
                <RowButton icon={<Bookmark />}> Sessions </RowButton>
                <RowButton icon={<ShowChart />}> Drafts </RowButton>
                <RowTitle> Classes </RowTitle>
                <Panel>
                  <RowButton icon={<ChromeReaderMode />}>PHYS 117 </RowButton>
                  <RowButton icon={<ChromeReaderMode />}>ECON 101 </RowButton>
                  <RowButton icon={<ChromeReaderMode />}>CS 340 </RowButton>
                </Panel>
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