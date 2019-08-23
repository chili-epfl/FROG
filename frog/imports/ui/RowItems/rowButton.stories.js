// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PlayArrow, NavigateNext } from '@material-ui/icons';

import { RowButton } from '.';
import { StorybookContainer } from '/imports/ui/StorybookContainer';

storiesOf('UI/RowItems/RowButton', module)
  .add('with text only', () => (
    <StorybookContainer width={250}>
      <RowButton>Hello World!</RowButton>
    </StorybookContainer>
  ))
  .add('with left icon', () => (
    <StorybookContainer width={250}>
      <RowButton icon={<PlayArrow fontSize="small" />}>Hello World!</RowButton>
    </StorybookContainer>
  ))
  .add('with right icon', () => (
    <StorybookContainer width={250}>
      <RowButton rightIcon={<NavigateNext fontSize="small" />}>
        Hello World!
      </RowButton>
    </StorybookContainer>
  ))
  .add('with both icons', () => (
    <StorybookContainer width={250}>
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<NavigateNext fontSize="small" />}
      >
        Hello World!
      </RowButton>
    </StorybookContainer>
  ))
  .add('with both icons - large', () => (
    <StorybookContainer width={250}>
      <RowButton
        size="large"
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<NavigateNext fontSize="small" />}
      >
        Hello World!
      </RowButton>
    </StorybookContainer>
  ))
  .add('disabled', () => (
    <StorybookContainer width={250}>
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<NavigateNext fontSize="small" />}
        disabled
      >
        Hello World!
      </RowButton>
    </StorybookContainer>
  ))
  .add('active', () => (
    <StorybookContainer width={250}>
      <RowButton
        icon={<PlayArrow fontSize="small" />}
        rightIcon={<NavigateNext fontSize="small" />}
        active
      >
        Hello World!
      </RowButton>
    </StorybookContainer>
  ));
