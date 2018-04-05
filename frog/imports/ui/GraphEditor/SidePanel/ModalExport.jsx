import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { uuid } from 'frog-utils';
import { Activities } from '/imports/api/activities';

type StateT = {
  title: string,
  description: string,
  tags: array
};

export default class ExportModal extends Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tags: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.activity.title });
  }

  render() {
    return (
      <Dialog open={this.props.modalOpen}>
        <DialogTitle>Export activity to the library:</DialogTitle>
        <DialogContent>
          <h3>Title</h3>
          <TextField
            defaultValue={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
            name="title"
          />
          <h3>Description</h3>
          <TextField
            value={this.state.description}
            multiline
            onChange={e => this.setState({ description: e.target.value })}
            id="exampleFormControlTextarea1"
            rows="3"
          />
          <div style={{ height: '20px' }} />
          <TagsInput
            value={this.state.tags}
            onChange={t => this.setState({ tags: t })}
          />
          <div style={{ height: '10px' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.setModal(false)}>Cancel</Button>
          <Button
            color="primary"
            onClick={() => {
              const newId = uuid();
              const act = {
                title: this.state.title,
                description: this.state.description,
                config: { ...this.props.activity.data },
                tags: '{'.concat(this.state.tags.join(',')).concat('}'),
                timestamp: new Date().toDateString(),
                parent_id: this.props.activity.parentId,
                uuid: newId,
                activity_type: this.props.activity.activityType
              };
              fetch('http://icchilisrv4.epfl.ch:5000/activities', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(act)
              });
              Activities.update(this.props.activity._id, {
                $set: { parentId: newId }
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
        </DialogActions>
      </Dialog>
    );
  }
}
