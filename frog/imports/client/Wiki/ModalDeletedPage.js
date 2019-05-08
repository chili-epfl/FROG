// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default ({
  closeModal,
  restoreDeletedPage,
  createNewLIForPage,
  pageId,
  pageTitle
}: Object) => {

  return (
    <Dialog open onClose={() => closeModal()}>
      <DialogTitle>{pageTitle}</DialogTitle>
      <DialogContent>
        <div
          style={{
            width: '600',
            height: '600'
          }}
        >
          Do you want to restore the old deleted page or create a new one?
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button
          style={{ color: 'blue' }}
          onClick={() => restoreDeletedPage(pageId, pageTitle)}
        >
          Restore Page
        </Button>
        <Button
          style={{ color: 'green' }}
          onClick={() => createNewLIForPage(pageId, pageTitle)}
        >
          Create New Page
        </Button>
      </DialogActions>
    </Dialog>
  );
};
