import React from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';

export default ({ deleteOpen, setDelete, remove }) => (
  <Modal
    isOpen={deleteOpen}
    contentLabel="Modal"
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
    <h2>Remove this activity from the library :</h2>

    <h3>Are you sure you want to remove this activity from the library ?</h3>
    <div style={{ height: '10px' }} />
    <Button className="btn btn-primary" onClick={() => setDelete(false)}>
      Cancel
    </Button>
    <Button
      className="btn btn-danger"
      onClick={() => {
        setDelete(false);
        remove();
      }}
    >
      Delete
    </Button>
  </Modal>
);
