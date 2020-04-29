// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { PlayArrow } from '@material-ui/icons';

import { Breadcrumb } from '.';
import { StorybookContainer } from '/imports/ui/StorybookContainer';

storiesOf('UI/Breadcrumb', module).add('simple', () => (
  <StorybookContainer width={300}>
    <Breadcrumb icon={<PlayArrow />} paths={['My Session', 'Ready']} />
  </StorybookContainer>
));
