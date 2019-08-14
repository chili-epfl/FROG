import * as React from 'react';

import {
  Bookmark,
  Bookmarks,
  ShowChart,
  Share, 
  Forward, 
  Delete,
  PlayArrow, 
  Create

} from '@material-ui/icons';
import { storiesOf } from '@storybook/react';
import { DashboardSideBar } from '../DashboardSideBar';
import { RecentsPage } from '.';


const overflowitems = [
  { title: 'Share', icon: Share, callback: null },
  { title: 'Clone', icon: Forward, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
const overflowitemsdraft = [
  { title: 'Run', icon: PlayArrow, callback: null },
  { title: 'Edit', icon: Create, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
const sessionsList = [
  {
    itemIcon: ShowChart,
    itemTitle: 'Session 1 ',
    status: 'Ready',
    itemType: 'Custom graph',
    dateCreated: '21/07/2019', 
    callback: null, 
    secondaryActions: overflowitems
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 2 ',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019',
    callback: null, 
    secondaryActions: overflowitems
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 3',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019',
    callback: null, 
    secondaryActions: overflowitems
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Session 4 ',
    status: 'Ready',
    itemType: 'Custom graph',
    dateCreated: '21/07/2019',
    callback: null, 
    secondaryActions: overflowitems
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 5',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019',
    callback: null, 
    secondaryActions: overflowitems
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 6',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019',
    callback: null, 
    secondaryActions: overflowitems
  }
];
const draftsList = [
  {  itemIcon: ShowChart, 
    itemTitle: 'Draft 1',
    itemType: 'Custom graph 1 ',
    dateCreated: '5/08/2019',
    callback: null, 
    secondaryActions: overflowitemsdraft
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 2',
    itemType: 'Custom graph 2',
    dateCreated: '5/08/2019',
    callback: null, 
    secondaryActions: overflowitemsdraft
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 3',
    itemType: 'Custom graph 432',
    dateCreated: '5/08/2019',
    callback: null, 
    secondaryActions: overflowitemsdraft
  },
  { itemIcon: ShowChart,
    itemTitle: 'Draft 4', itemType: 'Some graph', dateCreated: '5/08/2019',
  callback: null, 
  secondaryActions: overflowitemsdraft },
  {itemIcon: ShowChart,
    itemTitle: 'Draft 5',
    itemType: 'Custom graph dev test',
    dateCreated: '5/08/2019',
    callback: null, 
    secondaryActions: overflowitemsdraft
  },
  { itemIcon: ShowChart,
    itemTitle: 'Draft 6', 
    itemType: 'G1',
    dateCreated: '5/08/2019',
   callback: null , 
   secondaryActions: overflowitemsdraft
  }
];

const Wrapper = () => {
  return (
  
    <DashboardSideBar>
      <RecentsPage sessionsList = {sessionsList} draftsList = {draftsList} />
    </DashboardSideBar>

  );
};


storiesOf('Recents View with sidebar ', module).add('recents-page-with-sidebar', () => <Wrapper />);
