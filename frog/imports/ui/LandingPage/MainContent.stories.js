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
import { ClassView } from './ClassView';

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
  { itemTitle: 'Friday', status: 'Complete' }
];
const largeNumberofSessions = [
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' }
];
storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent title="My Sessions" action="Some action">
    <List>
      {itemList.map(({ itemTitle, status }, key) => (
        <ContentListItem
          key={key}
          itemTitle={itemTitle}
          itemIcon={Bookmark}
          status={status}
          overflowitems={overflowitems}
          // eslint-disable-next-line no-console
          callback={() => console.log('hello', key)}
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
  <ClassView
    sessionsList={itemListClasses}
    wikiInfo={{ title: 'Class discussions and notes', pagesCount: '9' }}
    overflowitems={overflowitems}
    numberOfStudents={30}
  />
));
storiesOf('Class view', module).add('Lots of sessions', () => (
  <ClassView
    sessionsList={largeNumberofSessions}
    wikiInfo={{ title: 'Class discussions and notes', pagesCount: '9' }}
    overflowitems={overflowitems}
    numberOfStudents={30}
  />
));
