import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { DropdownButton, MenuItem } from 'react-bootstrap';

import { connect, store } from '../store';
import { Graphs } from '../../../api/graphs';

export const GraphMenuSimple = connect(({ store: { graphId }, graphs }) =>
  <DropdownButton title="Select Graph" id="dropdown-basic-0">
    {graphs.length
      ? graphs.map(graph =>
          <MenuItem
            key={graph._id}
            eventKey={graph._id}
            active={graph._id === graphId}
            onClick={() => store.setId(graph._id)}
          >
            {graphId === graph._id &&
              <i className="fa fa-check" aria-hidden="true" />}
            {graph.name}
          </MenuItem>
        )
      : <MenuItem eventKey="0">No graph</MenuItem>}
  </DropdownButton>
);

export default createContainer(
  props => ({ ...props, graphs: Graphs.find().fetch() }),
  GraphMenuSimple
);
