// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { List } from '@material-ui/core';
import { Restore, Edit, PlayArrow } from '@material-ui/icons';
import { Sidebar } from '.';
import { Header } from './Header';
import { Panel } from './Panel';
import { SidebarListItem } from './ListItem';

storiesOf('Sidebar', module).add('simple', () => (
  <Sidebar header={<Header title="Lecture #1" subtitle="Quentin Golsteyn" />}>
    <Panel title="Private">
      <List>
        <SidebarListItem title="Recent" icon={<Restore />} />
        <SidebarListItem title="My Drafts" icon={<Edit />} />
        <SidebarListItem title="My Sessions" icon={<PlayArrow />} selected />
      </List>
    </Panel>
    <Panel title="Classes">
      <List>
        <SidebarListItem title="PHYS 170" />
        <SidebarListItem title="PHYS 157" />
        <SidebarListItem title="PHYS 158" />
      </List>
    </Panel>
  </Sidebar>
));
