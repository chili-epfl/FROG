// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

type ActionsT = Array<{
  title: string,
  primary: boolean,
  callback: () => void
}>;

type ModalPropsT = {
  title: string,
  children: React.Node
};

const Modal = ({ id, title, children, actions }: ModalPropsT) => (
  <Dialog open>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
  </Dialog>
);

export default Modal;
