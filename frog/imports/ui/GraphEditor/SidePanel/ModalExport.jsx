import React, { Component } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import PostgREST from 'postgrest-client';
import {uuid} from 'frog-utils';

import { Activities } from '/imports/api/activities';
import { addActivityToLibrary } from '/imports/api/activityLibrary';

type StateT = {
  title: string,
  description: string,
  tags: array
};

class ExportModal extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tags: []
    };
    this.Api = new PostgREST('http://icchilisrv4.epfl.ch:5000')
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalOpen}
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
        <input
          type="text"
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          name="title"
        />
        <h3>Description</h3>
        <textarea
          className="form-control"
          value={this.state.description}
          onChange={e => this.setState({ description: e.target.value })}
          id="exampleFormControlTextarea1"
          rows="3"
        />
        <TagsInput
          value={this.state.tags}
          onChange={t => this.setState({ tags: t })}
        />
        <div style={{ height: '10px' }} />
        <Button
          className="btn btn-danger"
          onClick={() => this.props.setModal(false)}
        >
          Cancel
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() => {
            this.Api.post('/activities')
              .send({uuid: uuid(), parentId: this.props.activity.parentId, title: this.state.title, description: this.state.description,  activityType: this.props.activity.activityType, config: { ...this.props.activity.data }, tags: this.state.tags})
              .then(x => console.log(x))
            const idExport = addActivityToLibrary(
              this.props.activity.parentId,
              this.state.title,
              this.state.description,
              this.props.activity.activityType,
              { ...this.props.activity.data },
              this.state.tags
            );
            Activities.update(this.props.activity._id, {
              $set: { parentId: idExport }
            });
            this.props.setModal(false);
            this.setState({
              title: '',
              description: '',
              tags: []
            });
          }}
          disabled={Boolean(!this.state.title || !this.state.description)}
        >
          Save
        </Button>
      </Modal>
    );
  }
}

export default ExportModal;
