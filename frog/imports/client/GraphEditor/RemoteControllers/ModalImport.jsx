// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

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
