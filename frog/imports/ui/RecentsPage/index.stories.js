import * as React from 'react';
import {
  AccessTimeOutlined,
  Bookmark,
  Bookmarks,
  ShowChart,
  ChromeReaderMode,
  SupervisedUserCircle,
  ArrowDropDown
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
import { Button } from '../Button/index';

const sessionsList = [
  {
    itemIcon: ShowChart,
    itemTitle: 'Session 1 ',
    status: 'Ready',
    itemType: 'Custom graph',
    dateCreated: '21/07/2019'
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 2 ',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019'
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 3',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019'
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Session 4 ',
    status: 'Ready',
    itemType: 'Custom graph',
    dateCreated: '21/07/2019'
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 5',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019'
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 6',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019'
  }
];
const draftsList = [
  {
    itemTitle: 'Draft 1',
    itemType: 'Custom graph 1 ',
    dateCreated: '5/08/2019'
  },
  {
    itemTitle: 'Draft 2',
    itemType: 'Custom graph 2',
    dateCreated: '5/08/2019'
  },
  {
    itemTitle: 'Draft 3',
    itemType: 'Custom graph 432',
    dateCreated: '5/08/2019'
  },
  { itemTitle: 'Draft 4', itemType: 'Some graph', dateCreated: '5/08/2019' },
  {
    itemTitle: 'Draft 5',
    itemType: 'Custom graph dev test',
    dateCreated: '5/08/2019'
  },
  { itemTitle: 'Draft 6', itemType: 'G1', dateCreated: '5/08/2019' }
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
            <TopBar
              variant="minimal"
              actions={
                <Button
                  icon={<SupervisedUserCircle fontSize="small" />}
                  rightIcon={<ArrowDropDown fontSize="small" />}
                >
                  Filter by date
                </Button>
              }
            />
            <RecentsPage sessionsList={sessionsList} draftsList={draftsList} />
          </>
        }
      />
    </>
  );
};

storiesOf('Recents View ', module).add('recents-page', () => <Wrapper />);
