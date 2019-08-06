// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { TripOrigin } from '@material-ui/icons';

import { Row } from '.';
import { StorybookContainer } from '../../StorybookContainer';

storiesOf('Sidebar/Row', module).add('simple', () => (
  <StorybookContainer width={300}>
    <Row leftIcon={<TripOrigin />} text="Quentin Golsteyn" />
  </StorybookContainer>
));
