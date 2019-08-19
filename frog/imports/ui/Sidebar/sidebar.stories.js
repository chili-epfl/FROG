// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PlayArrow } from '@material-ui/icons';

import { Sidebar, Panel } from '.';
import { Logo } from '/imports/ui/Logo';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

storiesOf('UI/Sidebar', module).add('with row items', () => (
  <Sidebar header={<Logo />}>
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
