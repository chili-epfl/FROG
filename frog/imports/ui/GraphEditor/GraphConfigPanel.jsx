import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Graphs, renameGraph } from '../../api/graphs';

const GraphConfigPanel = createContainer(
  props => ({ ...props, graph: Graphs.findOne({ _id: props.graphId }) }),
  ({ graph, graphId }) => (
    <input
      onChange={e => renameGraph(graphId, e.target.value)}
      value={graph ? graph.name : 'untitled'}
    />
  )
);

export default connect(({ store: { graphId } }) => (
  <GraphConfigPanel graphId={graphId} />
));
