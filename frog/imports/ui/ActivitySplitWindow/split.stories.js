// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Typography } from '@material-ui/core';
import { ActivitySplitWindow, ActivityWindow } from '.';

storiesOf('UI/ActivitySplitWindow', module)
  .add('one window', () => (
    <ActivitySplitWindow>
      <ActivityWindow title="First Activity">
        <Typography variant="h6">One part</Typography>
      </ActivityWindow>
    </ActivitySplitWindow>
  ))
  .add('two windows', () => (
    <ActivitySplitWindow>
      <ActivityWindow title="First Activity">
        <Typography variant="h6">One part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Second Activity">
        <Typography variant="h6">Two part</Typography>
      </ActivityWindow>
    </ActivitySplitWindow>
  ))
  .add('three windows', () => (
    <ActivitySplitWindow>
      <ActivityWindow title="First Activity">
        <Typography variant="h6">One part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Second Activity">
        <Typography variant="h6">Two part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Third Activity">
        <Typography variant="h6">Three part</Typography>
      </ActivityWindow>
    </ActivitySplitWindow>
  ))
  .add('four windows', () => (
    <ActivitySplitWindow>
      <ActivityWindow title="First Activity">
        <Typography variant="h6">One part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Second Activity">
        <Typography variant="h6">Two part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Third Activity">
        <Typography variant="h6">Three part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Fourth Activity">
        <Typography variant="h6">Four part</Typography>
      </ActivityWindow>
    </ActivitySplitWindow>
  ))
  .add('five windows', () => (
    <ActivitySplitWindow>
      <ActivityWindow title="First Activity">
        <Typography variant="h6">One part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Second Activity">
        <Typography variant="h6">Two part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Third Activity">
        <Typography variant="h6">Three part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Fourth Activity">
        <Typography variant="h6">Four part</Typography>
      </ActivityWindow>
      <ActivityWindow title="Fifth Activity">
        <Typography variant="h6">Five part</Typography>
      </ActivityWindow>
    </ActivitySplitWindow>
  ));
