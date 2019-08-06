// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Logo } from '.';
import { StorybookContainer } from '../StorybookContainer';

storiesOf('Logo', module).add('simple', () => (
  <StorybookContainer>
    <Logo />
  </StorybookContainer>
));
