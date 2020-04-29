// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { StorybookContainer } from '.';

storiesOf('UI/StorybookContainer', module)
  .add('simple', () => (
    <StorybookContainer width={500} height={200}>
      <div>Hello World!</div>
    </StorybookContainer>
  ))
  .add('multiple', () => (
    <StorybookContainer width={100} height={50}>
      <div>Hello World!</div>
      <div>Hello World!</div>
      <div>Hello World!</div>
    </StorybookContainer>
  ));
