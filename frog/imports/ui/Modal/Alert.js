// @flow

import * as React from 'react';
import { DialogContentText } from '@material-ui/core';
import { Modal, type ActionsT } from './Modal';

const defaultActions = [
  {
    title: 'Ok',
    primary: true,
    callback: () => {}
  }
];

type AlertModalPropsT = {
  title?: string,
  content: string,
  actions?: ActionsT
};

/** Displays a simple modal, consisting of a title and content, plus a couple actions */
export const AlertModal = (props: AlertModalPropsT) => {
  const actions = props.actions || defaultActions;

  return (
    <Modal
      title={props.title}
      actions={hideModal =>
        actions.map(action => ({
          ...action,
          callback: () => {
            if (action.callback) action.callback();
            hideModal();
          }
        }))
      }
    >
      <DialogContentText>{props.content}</DialogContentText>
    </Modal>
  );
};
