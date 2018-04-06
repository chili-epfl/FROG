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

import GraphsLibrary from './GraphsLibrary';
// import { uuid } from 'frog-utils';
// import { Activities } from '/imports/api/activities';
// import { Graphs } from '/imports/api/graphs';

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
    <DialogContent>
      <TextField
        value={searchStr}
        onChange={e => setSearchStr(e.target.value)}
        id="exampleFormControlTextarea1"
      />
      <div style={{ height: '10px' }} />
      <GraphsLibrary
        {...{ setModal, searchStr, importList, setImportList, setDelete, setIdRemove }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setModal(false)}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default withState('searchStr', 'setSearchStr', '')(ImportModal);
