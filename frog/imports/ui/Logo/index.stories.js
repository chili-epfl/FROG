// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Logo } from '.';
import { StorybookContainer } from '/imports/ui/StorybookContainer';

storiesOf('UI/Logo', module).add('simple', () => (
  <StorybookContainer>
    <Logo />
  </StorybookContainer>
));
