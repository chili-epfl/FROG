/* eslint-disable no-console */
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
  Bookmarks
} from '@material-ui/icons';
import List from '@material-ui/core/List';
import { MainContent } from '.';
import { ContentListItem } from '../ListItem';
import { ClassView } from '../ClassView';

// dummy data

const secondaryActionsSessions = [
  { title: 'Share', icon: Share, callback: null },
  { title: 'Clone', icon: Forward, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
const secondaryActionsDrafts = [
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
    secondaryActions: secondaryActionsSessions
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 2 ',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019',
    callback: null,
    secondaryActions: secondaryActionsSessions
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 3',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019',
    callback: null,
    secondaryActions: secondaryActionsSessions
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Session 4 ',
    status: 'Ready',
    itemType: 'Custom graph',
    dateCreated: '21/07/2019',
    callback: null,
    secondaryActions: secondaryActionsSessions
  },
  {
    itemIcon: Bookmarks,
    itemTitle: 'Session 5',
    status: 'Complete',
    itemType: 'Peer review template',
    dateCreated: '1/08/2019',
    callback: null,
    secondaryActions: secondaryActionsSessions
  },
  {
    itemIcon: Bookmark,
    itemTitle: 'Session 6',
    status: 'Running',
    itemType: 'Chat',
    dateCreated: '21/07/2019',
    callback: null,
    secondaryActions: secondaryActionsSessions
  }
];

const draftsList = [
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 1',
    itemType: 'Custom graph 1 ',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 2',
    itemType: 'Custom graph 2',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 3',
    itemType: 'Custom graph 432',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 4',
    itemType: 'Some graph',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 5',
    itemType: 'Custom graph dev test',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  },
  {
    itemIcon: ShowChart,
    itemTitle: 'Draft 6',
    itemType: 'G1',
    dateCreated: '5/08/2019',
    callback: null,
    secondaryActions: secondaryActionsDrafts
  }
];

storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent>
    <List>
      {sessionsList.map(
        (
          {
            itemIcon,
            itemTitle,
            status,
            itemType,
            dateCreated,
            callback,
            secondaryActions
          },
          index
        ) => (
          <ContentListItem
            key={index}
            itemTitle={itemTitle}
            itemIcon={itemIcon}
            itemType={itemType}
            status={status}
            dateCreated={dateCreated}
            secondaryActions={secondaryActions}
            callback={() => callback(index)}
          />
        )
      )}
    </List>
  </MainContent>
));
storiesOf('Drafts view', module).add('MainContent', () => (
  <MainContent title="My drafts" action="Create new graph">
    <List>
      {draftsList.map(
        ({ itemTitle, secondaryActions, itemIcon, itemType, dateCreated }) => (
          <ContentListItem
            itemTitle={itemTitle}
            itemIcon={itemIcon}
            itemType={itemType}
            dateCreated={dateCreated}
            secondaryActions={secondaryActions}
          />
        )
      )}
    </List>
  </MainContent>
));

storiesOf('Class view', module).add('MainContent', () => (
  <ClassView
    sessionsList={sessionsList}
    wikiInfo={{ title: 'Class discussions and notes', pagesCount: '9' }}
    numberOfStudents={30}
  />
));
