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
  Bookmark
} from '@material-ui/icons';
import List from '@material-ui/core/List';

import { BaseLayout } from '.';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import { Logo } from '../Logo';
import { Row } from '../Sidebar/Row';
import { Panel } from '../Sidebar/Panel';
import MainContent from '../LandingPage/MainContent';
import { ContentListItem } from '../LandingPage/ContentListItem';

const itemList = [
  { itemTitle: 'Session 1 ', status: 'Ready' },
  { itemTitle: 'Session 2', status: 'Running' },
  { itemTitle: 'Session 3', status: 'Complete' }
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
        <Row leftIcon={<PlayArrow />} text="My Sessions" active />
      </Panel>
      <Panel title="Classes">
        <Row text="PHYS 170" />
        <Row text="ELEC 221" />
        <Row text="CPSC 430" />
      </Panel>
    </Sidebar>
    <div>
      <TopBar
        icon={<PlayArrow />}
        paths={['My Sessions']}
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
      <MainContent>
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
    </div>
  </BaseLayout>
));
