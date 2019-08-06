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
import List from '@material-ui/core/List';
import MainContent from './MainContent';
import { ContentListItem } from './ContentListItem';

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
const itemList = [
  { itemTitle: 'Session 1 ', status: 'Ready' },
  { itemTitle: 'Session 2', status: 'Running' },
  { itemTitle: 'Session 3', status: 'Complete' }
];
const itemListDrafts = [
  { itemTitle: 'Draft 1' },
  { itemTitle: 'Draft 2' },
  { itemTitle: 'Draft 3' }
];
storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent title="My Sessions" action="Some action">
    {itemList.map(({ itemTitle, status }) => (
      <List>
        <ContentListItem
          itemTitle={itemTitle}
          itemIcon={Bookmark}
          status={status}
          overflowitems={overflowitems}
        />
      </List>
    ))}
  </MainContent>
));
storiesOf('Drafts view', module).add('MainContent', () => (
  <MainContent title="My drafts" action="Create new graph">
    {itemListDrafts.map(({ itemTitle }) => (
      <List>
        <ContentListItem
          itemTitle={itemTitle}
          itemIcon={ShowChart}
          overflowitems={overflowitemsdraft}
        />
      </List>
    ))}
  </MainContent>
));
