// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@material-ui/core';
import { ToastController, useToast } from '.';
import { type ActionT } from './types';

const ToastWrapper = (props: { actions?: ActionT[] }) => {
  const [showToast] = useToast();
  return (
    <>
      <Button
        onClick={() =>
          showToast('Hello, I am a toast', 'default', props.actions)
        }
      >
        Open Toast
      </Button>
      <Button
        onClick={() =>
          showToast('Hello, I am a toast', 'success', props.actions)
        }
      >
        Open Success Toast
      </Button>
      <Button
        onClick={() => showToast('Hello, I am a toast', 'error', props.actions)}
      >
        Open Error Toast
      </Button>
      <Button
        onClick={() =>
          showToast('Hello, I am a toast', 'warning', props.actions)
        }
      >
        Open Warning Toast
      </Button>
      <Button
        onClick={() => showToast('Hello, I am a toast', 'info', props.actions)}
      >
        Open Info Toast
      </Button>
    </>
  );
};

storiesOf('UI/Toast', module)
  .addDecorator(storyFn => <ToastController>{storyFn()}</ToastController>)
  .add('simple', () => <ToastWrapper />)
  .add('withActions', () => (
    <ToastWrapper
      actions={[
        {
          title: 'Reload'
        },
        {
          title: 'Remind me in 5 minutes'
        }
      ]}
    />
  ));
