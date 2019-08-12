// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MoreVert, Edit, Widgets } from '@material-ui/icons';

import { OverflowMenu } from '.';
import { StorybookContainer } from '../StorybookContainer';
import { Button } from '../Button';
import { RowTitle, RowDivider, RowButton } from '../RowItems';

storiesOf('OverflowMenu', module).add('with row items', () => (
  <StorybookContainer padding={16}>
    <OverflowMenu button={<Button icon={<MoreVert />} />}>
      <RowTitle>Logged in as Rachit</RowTitle>
      <RowButton icon={<Edit fontSize="small" />}>Edit Profile</RowButton>
      <RowButton icon={<Widgets fontSize="small" />}>
        View personal wiki
      </RowButton>
      <RowDivider />
      <RowButton>Logout</RowButton>
    </OverflowMenu>
  </StorybookContainer>
));
