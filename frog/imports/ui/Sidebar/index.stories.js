// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from '.';
import { Header } from './Header';
import { Panel } from './Panel';
import { List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { SidebarListItem } from './ListItem';
import { Restore, Edit, PlayArrow } from '@material-ui/icons';
import { ActionButton } from './ActionButton';

storiesOf('Sidebar', module).add('simple', () => (
  <Sidebar header={<Header title="Lecture #1" subtitle="Quentin Golsteyn" />}>
    <Panel title="Private">
      <SidebarListItem title="Recent" icon={<Restore />} />
      <SidebarListItem title="My Drafts" icon={<Edit />} />
      <SidebarListItem title="My Sessions" icon={<PlayArrow />} selected />
    </Panel>
    <Panel title="Classes">
      <SidebarListItem title="PHYS 170" />
      <SidebarListItem title="PHYS 157" />
      <SidebarListItem title="PHYS 158" />
    </Panel>
  </Sidebar>
));
