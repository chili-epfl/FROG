// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { StorybookContainer } from '.';

storiesOf('StorybookContainer', module).add('simple', () => (
  <StorybookContainer width={500} height={200}>
    Hello World!
  </StorybookContainer>
));
