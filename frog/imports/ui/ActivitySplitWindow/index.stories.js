// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { ActivitySplitWindow } from '.';
import { Typography } from '@material-ui/core';

storiesOf('UI/ActivitySplitWindow', module)
  .add('one window', () => (
    <ActivitySplitWindow>
      <Typography variant="h6">One part</Typography>
    </ActivitySplitWindow>
  ))
  .add('two windows', () => (
    <ActivitySplitWindow>
      <Typography variant="h6">One part</Typography>
      <Typography variant="h6">Two part</Typography>
    </ActivitySplitWindow>
  ))
  .add('three windows', () => (
    <ActivitySplitWindow>
      <Typography variant="h6">One part</Typography>
      <Typography variant="h6">Two part</Typography>
      <Typography variant="h6">Three part</Typography>
    </ActivitySplitWindow>
  ))
  .add('four windows', () => (
    <ActivitySplitWindow>
      <Typography variant="h6">One part</Typography>
      <Typography variant="h6">Two part</Typography>
      <Typography variant="h6">Three part</Typography>
      <Typography variant="h6">Four part</Typography>
    </ActivitySplitWindow>
  ))
  .add('five windows', () => (
    <ActivitySplitWindow>
      <Typography variant="h6">One part</Typography>
      <Typography variant="h6">Two part</Typography>
      <Typography variant="h6">Three part</Typography>
      <Typography variant="h6">Four part</Typography>
      <Typography variant="h6">Five part</Typography>
    </ActivitySplitWindow>
  ));
