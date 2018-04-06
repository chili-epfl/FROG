// @flow

import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withState } from 'recompose';

import Library from './RemoteLibrary';

const ImportModal = ({
  modalOpen,
  setModal,
  searchStr,
  setSearchStr,
  importList,
  setImportList,
  setDelete,
  setIdRemove
}) => (
  <Dialog open={modalOpen}>
    <DialogTitle>Import a graph from the library:</DialogTitle>
    <DialogContent
      style={{
        width: '350px',
        height: '650px',
        overflowY: 'scroll'
      }}
    >
      <TextField
        value={searchStr}
        onChange={e => setSearchStr(e.target.value)}
        id="exampleFormControlTextarea1"
      />
      <div style={{ height: '10px' }} />
      <Library
        libraryType="graph"
        {...{
          setModal,
          searchStr,
          importList,
          setImportList,
          setDelete,
          setIdRemove
        }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setModal(false)}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default withState('searchStr', 'setSearchStr', '')(ImportModal);
