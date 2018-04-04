import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import { uuid } from 'frog-utils';

import { Activities } from '/imports/api/activities';

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.activity.title });
  }

  render() {
    return (
      <Dialog
        title="Export activity to the library:"
        open={this.props.modalOpen}
      >
        <h3>Title</h3>
        <TextField
          defaultValue={this.state.title}
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
        <div style={{ display: 'flex', flexDirection: 'row' }}>
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
        </div>
      </Dialog>
    );
  }
}

const styles = {
  content: {
    width: '100%',
    padding: '20px',
    overflow: 'hidden'
  }
};

export default withStyles(styles)(ExportModal);
