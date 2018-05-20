// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withVisibility } from 'frog-utils';
import { IconButton } from './index';

export default withVisibility(
  ({ msg, onConfirmation, visible, setVisibility, tooltip }: Object) => (
    <React.Fragment>
      <IconButton
        onClick={() => setVisibility(true)}
        icon="glyphicon glyphicon-trash"
        tooltip={tooltip}
      />

      <Dialog open={visible}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>{msg}</DialogContentText>
        </DialogContent>
        <div style={{ height: '10px' }} />
        <DialogActions>
          <Button onClick={() => setVisibility(false)}>Cancel</Button>
          <Button
            color="secondary"
            onClick={() => {
              setVisibility(false);
              onConfirmation();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
);
