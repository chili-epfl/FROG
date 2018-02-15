import React, { Component } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';

class DeleteModal extends Component<Object> {
  componentDidMount() {
    Modal.setAppElement('#render-target');
  }

  render() {
    return (
      <Modal
        isOpen={this.props.deleteOpen}
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

        <h3>
          Are you sure you want to remove this activity from the library ?
        </h3>
        <div style={{ height: '10px' }} />
        <Button
          className="btn btn-primary"
          onClick={() => this.props.setDelete(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn btn-danger"
          onClick={() => {
            this.props.setDelete(false);
            this.props.remove();
          }}
        >
          Delete
        </Button>
      </Modal>
    );
  }
}

export default DeleteModal;
