// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from '.';
import { Header } from './Header';
import { Panel } from './Panel';

storiesOf('Sidebar', module).add('simple', () => (
  <Sidebar>
    <Header title="Lecture #1" subtitle="Quentin Golsteyn" />
    <Panel title="Activities">
      <div style={{ width: '100%', height: '200px', background: '#EAEAEA' }} />
    </Panel>
    <Panel title="Students">
      <div style={{ width: '100%', height: '300px', background: '#EAEAEA' }} />
    </Panel>
  </Sidebar>
));
