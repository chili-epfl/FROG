// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from '.';
import { StorybookContainer } from '../../StorybookContainer';

storiesOf('Sidebar/Header', module).add('simple', () => (
  <StorybookContainer width={300}>
    <Header title="Lecture #5" subtitle="Quentin Golsteyn" />
  </StorybookContainer>
));
