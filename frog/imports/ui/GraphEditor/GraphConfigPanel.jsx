// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Graphs, renameGraph } from '../../api/graphs';

const Config = ({ graph, graphId, _graphDuration, changeDuration }) => (
  <div className="topPanelUnit">
    <input
      onChange={e => renameGraph(graphId, e.target.value)}
      value={graph ? graph.name : 'untitled'}
    />
    <input
      type="number"
      name="duration"
      min="30"
      max="1200"
      onChange={e => {
        changeDuration(parseInt(e.target.value, 10));
      }}
      value={_graphDuration}
    />
  </div>
);

const GraphConfigPanel = createContainer(
  props => ({ ...props, graph: Graphs.findOne({ _id: props.graphId }) }),
  props => <Config {...props} />
);

export default connect(({
  store: { graphId, _graphDuration, changeDuration }
}) => <GraphConfigPanel {...{ graphId, _graphDuration, changeDuration }} />);
