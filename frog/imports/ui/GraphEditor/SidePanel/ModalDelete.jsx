import React from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const DeleteModal = ({ deleteOpen, setDelete, remove }) => (
  <Dialog open={deleteOpen} title="Remove this activity from the library:">
    <h3>Are you sure you want to remove this activity from the library ?</h3>
    <div style={{ height: '10px' }} />
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
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
    </div>
  </Dialog>
);

const styles = {
  content: {
    width: '100%',
    padding: '20px',
    overflow: 'hidden'
  }
};

export default withStyles(styles)(DeleteModal);
