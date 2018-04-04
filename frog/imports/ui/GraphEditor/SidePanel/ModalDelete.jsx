import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default ({ deleteOpen, setDelete, remove }) => (
  <Dialog
    title='Remove this activity from the library :'
    open={deleteOpen}
    style={{
      content: {
        top: '170px',
        left: 'auto',
        bottom: 'auto',
        right: '100px',
        overflow: 'hidden'
      }
    }}
  >
    <h3>Are you sure you want to remove this activity from the library ?</h3>
    <div style={{ height: '10px' }} />
    <FlatButton label="Cancel" onClick={() => setDelete(false)}/>
    <FlatButton
      label="Delete"
      secondary
      onClick={() => {
        setDelete(false);
        remove();
      }}
    />
  </Dialog>
);
