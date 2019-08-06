// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Details,
  Edit,
  PlayArrow,
  ExpandMore,
  People
} from '@material-ui/icons';
import { Sidebar } from '.';

import { Logo } from '../Logo';
import { Row } from './Row';
import { Panel } from './Panel';

storiesOf('Sidebar', module).add('simple', () => (
  <Sidebar>
    <Logo />
    <Row
      leftIcon={<People />}
      text="Quentin Golsteyn"
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
));
