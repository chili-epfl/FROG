import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { removeGraph } from '../../api/activities';
import { Graphs, addGraph } from '../../api/graphs';

import { connect, store } from './store';

const setCurrentGraph = graphId => {
  Meteor.users.update({ _id: Meteor.userId() }, {
    $set: { 'profile.editingGraph': graphId }
  });
  store.setId(graphId);
};

export const assignGraph = () => {
  const user = Meteor.users.findOne({ _id: Meteor.userId() });
  let graphId;
  // Get the graph the user is editing and check if the graph exists
  graphId = user.profile ? user.profile.editingGraph : null;
  graphId = graphId && Graphs.findOne({ _id: graphId }) ? graphId : null;
  // Assign the id of the first graph of the graph list if there is one
  const oneGraph = Graphs.findOne();
  if (!graphId) graphId = oneGraph ? oneGraph._id : null;
  // If nothing worked create new graph
  if (!graphId) graphId = addGraph();
  setCurrentGraph(graphId);
};

const submitRemoveGraph = id => {
  removeGraph(id);
  assignGraph();
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
                <a href="#" onClick={() => setCurrentGraph(graph._id)}>
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
