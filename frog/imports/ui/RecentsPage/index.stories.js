import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  ShowChart,
  ChromeReaderMode
} from '@material-ui/icons';
import { storiesOf } from '@storybook/react';
import { Typography } from '@material-ui/core';
import { Sidebar, Panel } from '../Sidebar';
import { Logo } from '../Logo';
import { SidebarLayout } from '../Layout/SidebarLayout';
import { RowTitle } from '../RowItems/RowTitle';
import { RowButton } from '../RowItems/RowButton';
import { TopBar } from '../TopBar';
import { Breadcrumb } from '../Breadcrumb';
import { RecentsPage } from './index';

const sessionsList = [
  { itemTitle: 'Session 1 ', status: 'Ready' },
  { itemTitle: 'Session 2', status: 'Running' },
  { itemTitle: 'Session 3', status: 'Complete' },
  { itemTitle: 'Session 1 ', status: 'Ready' },
  { itemTitle: 'Session 2', status: 'Running' },
  { itemTitle: 'Session 3', status: 'Complete' }
];
const draftsList = [
  { itemTitle: 'Draft 1' },
  { itemTitle: 'Draft 2' },
  { itemTitle: 'Draft 3' },
  { itemTitle: 'Draft 4' },
  { itemTitle: 'Draft 5' },
  { itemTitle: 'Draft 6' }
];

const classList = [
  { title: 'PHYS 117' },
  { title: 'CPSC 340' },
  { title: 'ECON 400' },
  { title: 'PHYS 117' },
  { title: 'CPSC 340' },
  { title: 'ECON 400' }
];

const Wrapper = () => {
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
          >
            <Panel>
              <RowButton active icon={<AccessTimeOutlined />}>
                {' '}
                Recents{' '}
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
            <RecentsPage
              sessionsList={sessionsList}
              draftsList={draftsList}
              classList={classList}
            />
          </>
        }
      />
    </>
  );
};

storiesOf('Recents View ', module).add('recents-page', () => <Wrapper />);
