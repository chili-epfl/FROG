// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PlayArrow } from '@material-ui/icons';

import { Sidebar, Panel } from '.';
import { Logo } from '/imports/ui/Logo';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

<<<<<<< HEAD
storiesOf('UI/Sidebar', module).add('with row items', () => (
  <Sidebar header={<Logo />}>
=======
storiesOf('Sidebar', module).add('with row items', () => (
  <Sidebar
    header={<Logo />}
    footer={<RowButton icon={<PlayArrow />}> Create now </RowButton>}
  >
>>>>>>> 71880865b88f3b1d2477ac141cd0b891bfbf6def
    <Panel>
      <RowButton>Row button without icons</RowButton>
      <RowButton icon={<PlayArrow fontSize="small" />}>
        Row button with icon
      </RowButton>
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<PlayArrow fontSize="small" />}
      >
        Row button with both icons
      </RowButton>
    </Panel>
    <Panel>
      <RowTitle>Test Title</RowTitle>
      <RowButton>Row button without icons</RowButton>
      <RowButton icon={<PlayArrow fontSize="small" />}>
        Row button with icon
      </RowButton>
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<PlayArrow fontSize="small" />}
      >
        Row button with both icons
      </RowButton>
    </Panel>
  </Sidebar>
));
