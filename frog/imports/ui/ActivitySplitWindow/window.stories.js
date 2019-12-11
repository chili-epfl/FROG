// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Typography } from '@material-ui/core';
import { ActivityWindow } from './Window';

storiesOf('UI/ActivityWindow', module)
  .add('with title', () => (
    <ActivityWindow title="Hello">
      <Typography variant="h6">Content</Typography>
    </ActivityWindow>
  ))
  .add('without title', () => (
    <ActivityWindow>
      <Typography variant="h6">Content</Typography>
    </ActivityWindow>
  ));
