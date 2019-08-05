// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { SidebarListItem } from '.';
import { StorybookContainer } from '../../StorybookContainer';

storiesOf('Sidebar/ListItem', module).add('simple', () => (
  <StorybookContainer width={300}>
    <SidebarListItem title="Test" />
  </StorybookContainer>
));
