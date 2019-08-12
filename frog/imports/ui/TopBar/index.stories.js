// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
<<<<<<< HEAD
import { action } from '@storybook/addon-actions';
import { PlayArrow, Details } from '@material-ui/icons';
import { TopBar } from '.';
=======
import { Details } from '@material-ui/icons';
import { TopBar } from '.';
import { Breadcrumb } from '../Breadcrumb';
import { Button } from '../Button';
>>>>>>> cf54266f13f273a46fc131cb3072d9c9ba7bf8ce

const SimpleWrapper = () => {
  return (
    <TopBar
<<<<<<< HEAD
      icon={<Details />}
      paths={['Recent']}
      primaryActions={[
        {
          id: 'start',
          title: 'Start session',
          icon: <PlayArrow />,
          callback: action('action_callback')
        },
        {
          id: 'projector',
          title: 'Open projector view',
          callback: action('action_callback')
        }
      ]}
      secondaryActions={[
        {
          id: 'start',
          title: 'Start session',
          icon: <PlayArrow />,
          callback: action('action_callback')
        },
        {
          id: 'projector',
          title: 'Open projector view',
          callback: action('action_callback')
        }
      ]}
=======
      navigation={<Breadcrumb icon={<Details />} paths={['Recent']} />}
      actions={
        <>
          <Button>Clear recents</Button>
        </>
      }
>>>>>>> cf54266f13f273a46fc131cb3072d9c9ba7bf8ce
    />
  );
};

storiesOf('TopBar', module).add('simple', () => <SimpleWrapper />);
