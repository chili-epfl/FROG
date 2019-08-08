// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  PlayArrow,
  Details,
  Edit,
  People,
  ExpandMore,
  Share,
  Forward,
  Delete,
  ChromeReaderMode,
  Bookmark
} from '@material-ui/icons';
import {List,Typography,Divider} from '@material-ui/core';

import { BaseLayout } from '.';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import { Logo } from '../Logo';
import { Row } from '../Sidebar/Row';
import { Panel } from '../Sidebar/Panel';
import MainContent from '../LandingPage/MainContent';
import { ContentListItem } from '../LandingPage/ContentListItem';

const itemListClasses = [
  { itemTitle: 'Monday', status: 'Ready' },
  { itemTitle: 'Wednesday', status: 'Running' },
  { itemTitle: 'Friday', status: 'Complete' },
  { itemTitle: 'Wiki', status: 'chilifrog.ch/wiki/XKCD' }
];

const overflowitems = [
  { title: 'Share', icon: Share, callback: null },
  { title: 'Clone', icon: Forward, callback: null },
  { title: 'Delete', icon: Delete, callback: null }
];

storiesOf('BaseLayout', module).add('simple', () => (
  <BaseLayout>
    <Sidebar>
      <Logo />
      <Row
        leftIcon={<People />}
        text="John Doe"
        rightIcon={<ExpandMore />}
        variant="large"
      />
      <Panel>
        <Row leftIcon={<Details />} text="Recent" />
        <Row leftIcon={<Edit />} text="My Drafts" />
        <Row leftIcon={<PlayArrow />} text="My Sessions" />
      </Panel>
      <Panel title="Classes">
        <Row text="PHYS 170" active />
        <Row text="ELEC 221" />
        <Row text="CPSC 430" />
      </Panel>
    </Sidebar>
    <div>
      <TopBar
        icon={<PlayArrow />}
        paths={['Classes/PHYS 117']}
        primaryActions={[
          {
            id: 'start',
            title: 'Start session',
            icon: <PlayArrow />
          },
          {
            id: 'projector',
            title: 'Open projector view'
          }
        ]}
        secondaryActions={[
          {
            id: 'start',
            title: 'Some other action',
            icon: <PlayArrow />
          },
          {
            id: 'projector',
            title: 'Another action'
          }
        ]}
      />
  
  <MainContent title = "Class Slug: XKCD">
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
    </div>
  </BaseLayout>
));
