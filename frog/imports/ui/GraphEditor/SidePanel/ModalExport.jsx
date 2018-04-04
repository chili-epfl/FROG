import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
<<<<<<< HEAD
import {FlatButton} from 'material-ui';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
// import PostgREST from '@houshuang/postgrest-client';

=======
import FlatButton from 'material-ui/FlatButton';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
>>>>>>> c2489b1b354bce625dde8be5f930cdcec8d71605
import { uuid } from 'frog-utils';

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
//    this.Api = new PostgREST('http://icchilisrv4.epfl.ch:5000');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.activity.title });
  }

  render() {
    return (
      <Dialog
        title='Export activity to the library:'
        open={this.props.modalOpen}
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
        <FlatButton label='Cancel' onClick={() => this.props.setModal(false)} />
        <FlatButton label='Save' onClick={() => {
<<<<<<< HEAD
            const act = {
=======
            this.Api.post('/activities')
              .send({
>>>>>>> c2489b1b354bce625dde8be5f930cdcec8d71605
                uuid: uuid(),
                parentId: this.props.activity.parentId,
                title: this.state.title,
                description: this.state.description,
                activityType: this.props.activity.activityType,
                config: { ...this.props.activity.data },
<<<<<<< HEAD
                tags: this.state.tags,
                exportedAt: new Date()
              }
            fetch('http://icchilisrv4.epfl.ch:5000/activities',{method: 'POST', body: JSON.stringify(act)}).then(x => console.log(x));
=======
                tags: this.state.tags
              })
              .then(x => console.log(x));
>>>>>>> c2489b1b354bce625dde8be5f930cdcec8d71605
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
        />
      </Dialog>
    );
  }
}

export default ExportModal;
