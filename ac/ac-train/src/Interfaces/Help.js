// @flow

import * as React from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const Help = ({
  onOpen,
  onClose,
  open,
  children
}: {
  onOpen: Function,
  onClose: Function,
  open: boolean,
  children?: React.Node
}) => (
  <React.Fragment>
    <Button color="secondary" onClick={onOpen}>
      Help
    </Button>
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-help"
      aria-describedby="alert-dialog-slide-description"
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-slide-help">Help</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </React.Fragment>
);

export default Help;
