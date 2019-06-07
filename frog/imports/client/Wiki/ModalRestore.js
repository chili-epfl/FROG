// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default ({ setModalOpen, pages, onSelect }: Object) => {
  return (
    <Dialog open onClose={() => setModalOpen(false)}>
      <DialogTitle>Restore page</DialogTitle>
      <DialogContent>
        <div
          style={{
            width: '600px',
            height: '600px',
            overflow: 'auto',
            paddingRight: '100px'
          }}
        >
          <ul>
            {pages.map(pageObj => {
              const pageId = pageObj.id;
              const pageTitle = pageObj.title;

              return (
                <li
                  key={pageId}
                  style={{
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    onSelect(pageId, pageTitle);
                    setModalOpen(false);
                    e.preventDefault();
                  }}
                >
                  {pageTitle}
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
