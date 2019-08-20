// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Edit, MoreVert, Widgets, SupervisedUserCircle, Details} from '@material-ui/icons';

import { TopBar } from '.';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { StorybookContainer } from '/imports/ui/StorybookContainer';
import { RowTitle } from '/imports/ui/RowItems';
import { RowButton, RowDivider} from '/imports/ui/RowItems';




const SimpleWrapper = () => {
  return (
    <TopBar
      navigation={<Breadcrumb icon={<Details />} paths={['Recent']} />}
      actions={
        
        <OverflowMenu button={<Button variant = 'minimal' icon={<SupervisedUserCircle />} />}>
          <RowTitle>Logged in as Rachit</RowTitle>
          <RowButton icon={<Edit fontSize="small" />}>Edit Profile</RowButton>
          <RowDivider />
          <RowButton>Logout</RowButton>
        </OverflowMenu>
     
      }
    />
  );
};

storiesOf('UI/TopBar', module).add('simple', () => <SimpleWrapper />);
