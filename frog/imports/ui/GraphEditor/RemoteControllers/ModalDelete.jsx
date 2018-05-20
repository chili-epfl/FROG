// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default ({ modalOpen, setModal, remove }: Object) => (
  <Dialog open={modalOpen}>
    <DialogTitle>Remove this activity from the library:</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to remove this activity from the library ?
      </DialogContentText>
    </DialogContent>
    <div style={{ height: '10px' }} />
    <DialogActions>
      <Button onClick={() => setModal(false)}>Cancel</Button>
      <Button
        color="secondary"
        onClick={() => {
          setModal(false);
          remove();
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
