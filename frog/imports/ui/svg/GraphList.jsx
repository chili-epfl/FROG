import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { removeGraph } from '../../api/activities';
import { Graphs, addGraph, assignGraph } from '../../api/graphs';

import { connect, store } from './store';

const submitRemoveGraph = id => {
  removeGraph(id);
  store.setId(assignGraph());
};

const GL = createContainer(
  props => ({ ...props, graphs: Graphs.find().fetch() }),
  ({ graphs, graphId }) => (
    <div>
      <h3>Graph list</h3>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => store.setId(addGraph())}
      >
        New
      </button>
      <ul>
        {graphs.length ? graphs.map(graph => (
              <li style={{ listStyle: 'none' }} key={graph._id}>
                <a href="#" onClick={() => submitRemoveGraph(graph._id)}>
                  <i className="fa fa-times" />
                </a>
                <a href="#" onClick={() => store.setId(graph._id)}>
                  <i className="fa fa-pencil" />
                </a>
                {graph._id} {graph._id === graphId ? ' (current)' : null}
              </li>
            )) : <li>No graph</li>}
      </ul>
    </div>
  )
);

export const GraphList = connect(({ store: { id } }) => <GL graphId={id} />);
