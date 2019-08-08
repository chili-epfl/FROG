// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MoreVert, Bluetooth } from '@material-ui/icons';

import { OverflowMenu } from '.';
import { StorybookContainer } from '../StorybookContainer';
import { MinimalIconButton, RowButton } from '../Button';

storiesOf('OverflowMenu', module).add('simple', () => (
  <StorybookContainer>
    <OverflowMenu button={<MinimalIconButton icon={<MoreVert />} />}>
      <RowButton text="Do stuff" />
      <RowButton icon={<Bluetooth />} text="Turn off lights" />
    </OverflowMenu>
  </StorybookContainer>
));
