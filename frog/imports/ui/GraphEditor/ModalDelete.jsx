import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

export default ({ deleteOpen, setDelete, remove }) => (
  <Dialog open={deleteOpen}>
    <DialogTitle>Remove this activity from the library:</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to remove this activity from the library ?
      </DialogContentText>
    </DialogContent>
    <div style={{ height: '10px' }} />
    <DialogActions>
      <Button onClick={() => setDelete(false)}>Cancel</Button>
      <Button
        color="secondary"
        onClick={() => {
          setDelete(false);
          remove();
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
