// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  PlayArrow,
  Details,
  Edit,
  People,
  ExpandMore
} from '@material-ui/icons';

import { BaseLayout } from '.';
import { Sidebar } from '../Sidebar';
import { TopBar } from '../TopBar';
import { Logo } from '../Logo';
import { Row } from '../Sidebar/Row';
import { Panel } from '../Sidebar/Panel';

storiesOf('BaseLayout', module).add('simple', () => (
  <BaseLayout>
    <Sidebar>
      <Logo />
      <Row
        leftIcon={<People />}
        text="Quentin Golsteyn"
        rightIcon={<ExpandMore />}
        variant="large"
      />
      <Panel>
        <Row leftIcon={<Details />} text="Recent" active />
        <Row leftIcon={<Edit />} text="My Drafts" />
        <Row leftIcon={<PlayArrow />} text="My Sessions" />
      </Panel>
      <Panel title="Classes">
        <Row text="PHYS 170" />
        <Row text="ELEC 221" />
        <Row text="CPSC 430" />
      </Panel>
    </Sidebar>
    <div>
      <TopBar
        icon={<Details />}
        paths={['Recent']}
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
            title: 'Start session',
            icon: <PlayArrow />
          },
          {
            id: 'projector',
            title: 'Open projector view'
          }
        ]}
      />
    </div>
  </BaseLayout>
));
