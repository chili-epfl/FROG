import React from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { compose, withState } from 'recompose';

import { addActivityToLibrary } from '/imports/api/library';

 const MyModal = ({modalOpen, setModal, title, setTitle, desc, setDesc}: Object) => (<Modal
  isOpen={modalOpen}
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
    <h2>Export activity to the library:</h2>
    <h3>Title</h3>
    <input type="text" value={title} onChange={e => setTitle(e.target.value)} name="title" />
    <h3>Description</h3>
    <textarea className="form-control" value={desc} onChange={e => setDesc(e.target.value)} id="exampleFormControlTextarea1" rows="3"/>
    <div style={{height: '10px'}}/>
    <Button className='btn btn-danger' onClick={() => setModal(false)}>Cancel</Button>
    <Button className='btn btn-primary' onClick={() => null}>Save</Button>
  </Modal>)

export default compose(
  withState('title', 'setTitle', ''),
  withState('desc', 'setDesc', '')
) (MyModal);
