// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@material-ui/core';
import { ModalController, AlertModal, useModal } from '.';
import { type ActionsT } from './Modal';

const AlertModalWrapper = (props: {
  title: string,
  content: string,
  actions?: ActionsT
}) => {
  const [showModal] = useModal();
  return (
    <Button onClick={() => showModal(<AlertModal {...props} />)}>
      Open Alert Modal
    </Button>
  );
};

storiesOf('Modal/AlertModal', module)
  .addDecorator(storyFn => <ModalController>{storyFn()}</ModalController>)
  .add('simple', () => (
    <AlertModalWrapper title="Hello World!" content="This is an alert modal." />
  ))
  .add('confirmation', () => (
    <AlertModalWrapper
      title="Delete this wiki page?"
      content="This action is final and cannot be undone"
      actions={[
        { title: 'Cancel', callback: () => {} },
        { title: 'Ok', primary: true, callback: () => {} }
      ]}
    />
  ));
