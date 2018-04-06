// @flow
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

import { sendActivity } from '/imports/api/remoteActivities';
import { sendGraph } from '/imports/api/remoteGraphs';
import { Graphs } from '/imports/api/graphs';

type StateT = {
  title: string,
  description: string,
  tags: Array<string>
};

export default class ExportModal extends Component<Object, StateT> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: '',
      description: '',
      tags: []
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    const name = nextProps.activity
      ? nextProps.activity.title
      : Graphs.findOne({ _id: this.props.graphId }).name;
    this.setState({
      title: name
    });
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
              if (this.props.exportType === 'activity')
                sendActivity(this.state, this.props);
              else if (this.props.exportType === 'graph')
                sendGraph(this.state, this.props);
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
