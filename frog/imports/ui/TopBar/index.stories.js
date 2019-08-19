// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Details } from '@material-ui/icons';

import { TopBar } from '.';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';

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

storiesOf('UI/TopBar', module).add('simple', () => <SimpleWrapper />);
