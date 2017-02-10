import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Graphs, renameGraph } from '../../api/graphs';

const GCP = createContainer(
  props => ({ ...props, graph: Graphs.findOne({ _id: props.graphId }) }),
  ({ graph, graphId }) => (
    <div>
      <p>Graph name:</p>
      <input
        onChange={e => renameGraph(graphId, e.target.value)}
        value={graph ? graph.name : 'untitled'}
      />
    </div>
  )
);

const GraphConfigPanel = connect(({ store: { id } }) => <GCP graphId={id} />);

export default GraphConfigPanel;
