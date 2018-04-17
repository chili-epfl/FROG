// @flow

import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import Library from './RemoteLibrary';

export default (props: Object) => (
  <Dialog open={props.modalOpen}>
    <DialogTitle>Import a graph from the library:</DialogTitle>
    <DialogContent
      style={{
        width: '350px',
        height: '650px',
        overflowY: 'scroll'
      }}
    >
      <div style={{ height: '10px' }} />
      <Library libraryType="graph" {...props} />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => props.setModal(false)}>Cancel</Button>
    </DialogActions>
  </Dialog>
);
