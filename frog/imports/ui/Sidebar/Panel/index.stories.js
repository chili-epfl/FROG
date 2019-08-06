// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Panel } from '.';
import { StorybookContainer } from '../../StorybookContainer';

storiesOf('Sidebar/Panel', module).add('simple', () => (
  <StorybookContainer width={300}>
    <Panel title="Panel Title">
      <div style={{ width: '100%', height: '200px', background: '#EAEA' }} />
    </Panel>
  </StorybookContainer>
));
