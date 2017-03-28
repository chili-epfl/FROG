import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { DropdownButton, MenuItem } from 'react-bootstrap';

import { connect, store } from '../store';
import { removeGraph } from '../../../api/activities';
import {
  Graphs,
  addGraph,
  assignGraph,
  duplicateGraph
} from '../../../api/graphs';

const submitRemoveGraph = id => {
  removeGraph(id);
  store.ui.setStickySelected(null);
  store.setId(assignGraph());
};

const GraphList = createContainer(
  props => ({ ...props, graphs: Graphs.find().fetch() }),
  ({ graphs, graphId }) => (
    <div className="topPanelUnit">
      <button
        className="btn btn-primary btn-sm"
        onClick={() => store.setId(addGraph())}
      >
        New
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => submitRemoveGraph(graphId)}
      >
        Delete
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => duplicateGraph(graphId)}
      >
        Copy
      </button>
      <DropdownButton title="Select Graph" id="dropdown-basic-0">
        {graphs.length
          ? graphs.map(graph => (
              <MenuItem
                key={graph._id}
                eventKey={graph._id}
                active={graph._id === graphId}
                onClick={() => store.setId(graph._id)}
              >
                {graph.name}
              </MenuItem>
            ))
          : <MenuItem eventKey="0">No graph</MenuItem>}
      </DropdownButton>
    </div>
  )
);

export default connect(({ store: { graphId } }) => (
  <GraphList graphId={graphId} />
));
