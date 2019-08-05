import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Delete, Share, Forward } from '@material-ui/icons';
import MainContent from './MainContent';

const overflowitems = [
  { title: 'Share', icon: Share, callback: null },
  { title: 'Clone', icon: Forward, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];
storiesOf('Sessions view', module).add('MainContent', () => (
  <MainContent
    itemList={['Session 1 ', 'Session 2', 'Session 3']}
    title="My Sessions"
    action="Some action"
    overflowitems={overflowitems}
  />
));
