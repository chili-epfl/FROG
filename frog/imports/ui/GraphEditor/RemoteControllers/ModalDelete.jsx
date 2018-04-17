// @flow

import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

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
