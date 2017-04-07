import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect, store } from '../store';
import { Graphs, renameGraph } from '../../../api/graphs';
import TextInput from '../utils/TextInput';

class Config extends Component {
  state: { editingTitle: boolean, editingTime: false };

  constructor(props) {
    super(props);
    this.state = { editingTitle: false, editingTime: false };
  }

  render() {
    const { graph } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.editingTitle
          ? <TextInput
              value={graph ? graph.name : 'untitled'}
              onChange={e => this.setState({ title: e })}
              onCancel={() => this.setState({ editingTitle: false })}
              onSubmit={() => {
                renameGraph(graph._id, this.state.title);
                this.setState({ editingTitle: false });
              }}
            />
          : <a
              href="#"
              style={{ textDecoration: 'none' }}
              onClick={e => {
                e.preventDefault();
                this.setState({
                  editingTitle: true,
                  title: graph.name
                });
              }}
            >
              <span
                style={{
                  color: '#000000',
                  fontSize: '20px',
                  fontWeight: '900'
                }}
              >
                {graph.name}
              </span>
              <i className="edithover fa fa-pencil" />
            </a>}
        <span style={{ marginLeft: '20px' }}>
          {this.state.editingTime
            ? <TextInput
                style={{ width: '60px' }}
                value={graph ? graph.duration : 30}
                onChange={e => this.setState({ duration: e })}
                onCancel={() => this.setState({ editingTime: false })}
                onSubmit={() => {
                  store.changeDuration(parseInt(this.state.duration, 10));
                  this.setState({
                    editingTime: false,
                    duration: graph.duration
                  });
                }}
              />
            : <a
                href="#"
                style={{ textDecoration: 'none' }}
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    editingTime: true,
                    duration: graph.duration
                  });
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    color: '#000000'
                  }}
                >
                  {graph.duration} mins.
                </span>
                <i className="edithover fa fa-pencil" />
              </a>}
        </span>
      </div>
    );
  }
}

const GraphConfigPanel = createContainer(
  props => ({ ...props, graph: Graphs.findOne({ _id: props.graphId }) }),
  Config
);

export default connect(({ store: { graphId } }) => (
  <GraphConfigPanel graphId={graphId} />
));
