import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Delete,
  Share,
  Forward,
  Bookmark,
  ShowChart,
  PlayArrow,
  Create,
  ChromeReaderMode
} from '@material-ui/icons';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';
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
const itemListClasses = [
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Wiki', status: 'chilifrog.ch/wiki/XKCD' }
];
storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent title="My Sessions" action="Some action">
    <List>
      {itemList.map(({ itemTitle, status }) => (
        <ContentListItem
          itemTitle={itemTitle}
          itemIcon={Bookmark}
          status={status}
          overflowitems={overflowitems}
        />
      ))}
    </List>
  </MainContent>
));
storiesOf('Drafts view', module).add('MainContent', () => (
  <MainContent title="My drafts" action="Create new graph">
    <List>
      {itemListDrafts.map(({ itemTitle }) => (
        <ContentListItem
          itemTitle={itemTitle}
          itemIcon={ShowChart}
          overflowitems={overflowitemsdraft}
        />
      ))}
    </List>
  </MainContent>
));

storiesOf('Class view', module).add('MainContent', () => (
  <MainContent action="Create new graph">
    <Typography variant="h5">Sessions </Typography>
    <Divider />
    <List>
      {itemListClasses.map(({ itemTitle, status }) => (
        <ContentListItem
          itemTitle={itemTitle}
          status={status}
          itemIcon={Bookmark}
          overflowitems={overflowitems}
        />
      ))}
    </List>
    <Typography variant="h5">Student information </Typography>
    <Divider />
    <List>
      <ContentListItem
        itemTitle="Number of students"
        status="200"
        itemIcon={ChromeReaderMode}
        overflowitems={[
          { title: 'View student list', icon: ChromeReaderMode, callback: null }
        ]}
      />
    </List>
  </MainContent>
));
