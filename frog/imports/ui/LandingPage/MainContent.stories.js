import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Delete,
  Share,
  Forward,
  Bookmark,
  ShowChart,
  PlayArrow,
  Create
} from '@material-ui/icons';
import MainContent from './MainContent';

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
storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent
    itemList={[
      { itemTitle: 'Session 1 ', status: 'Ready' },
      { itemTitle: 'Session 2', status: 'Running' },
      { itemTitle: 'Session 3', status: 'Complete' }
    ]}
    title="My Sessions"
    action="Some action"
    itemIcon={Bookmark}
    overflowitems={overflowitems}
  />
));
storiesOf('Drafts view', module).add('MainContent', () => (
  <MainContent
    itemList={[
      { itemTitle: 'Draft 1 ' },
      { itemTitle: 'Draft 2' },
      { itemTitle: 'Draft 3' }
    ]}
    title="My drafts"
    action="Create new graph"
    itemIcon={ShowChart}
    overflowitems={overflowitemsdraft}
  />
));
