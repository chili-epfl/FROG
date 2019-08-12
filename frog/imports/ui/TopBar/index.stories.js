// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Details } from '@material-ui/icons';
import { TopBar } from '.';
import { Breadcrumb } from '../Breadcrumb';
import { Button } from '../Button';

const SimpleWrapper = () => {
  return (
    <TopBar
      navigation={<Breadcrumb icon={<Details />} paths={['Recent']} />}
      actions={
        <>
          <Button>Clear recents</Button>
        </>
      }
    />
  );
};

storiesOf('TopBar', module).add('simple', () => <SimpleWrapper />);
