// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { Progress } from '.';
import { Button } from '/imports/ui/Button';
import { StorybookContainer } from '/imports/ui/StorybookContainer';

storiesOf('UI/Progress', module).add('simple', () => (
  <StorybookContainer padding={16}>
    <Progress size="small" />
    <Progress />
    <Progress size="large" />
  </StorybookContainer>
));

storiesOf('UI/Progress', module).add('with Button', () => (
  <StorybookContainer padding={16}>
    <Button rightIcon={<Progress size="small" />}>Loading</Button>
    <Button variant="primary" rightIcon={<Progress size="small" />}>
      Loading
    </Button>
  </StorybookContainer>
));
