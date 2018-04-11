// @flow

import * as React from 'react';
import Button from 'material-ui/Button';
import HelpOutLine from 'material-ui-icons/HelpOutline';
import IconButton from 'material-ui/IconButton';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';

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
    <IconButton onClick={onOpen}>
      <HelpOutLine />
    </IconButton>
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Help</DialogTitle>
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
