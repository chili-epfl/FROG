// @flow

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { A } from 'frog-utils';

import { Sessions } from '../api/sessions';
import {
  Activities,
  Operators,
  Connections,
  importActivity,
  importOperator,
  importConnection,
  deleteDatabase
} from '../api/activities';
import { Graphs, importGraph } from '../api/graphs';

import { mixedJigsaw } from '../datasets/mixedJigsaw';
import { argueGraph } from '../datasets/argueGraph';

const loadDatabase = data => {
  data.graphs.forEach(item => importGraph(item));
  data.activities.forEach(item => importActivity(item));
  data.operators.forEach(item => importOperator(item));
  data.connections.forEach(item => importConnection(item));
};

class DisplayData extends Component {
  constructor(props) {
    super(props);
    this.state = { isClicked: false };
  }

  state = {
    isClicked: Boolean
  };

  toggleDisplay = event => {
    event.preventDefault();
    this.setState({ isClicked: !this.state.isClicked });
  };

  render() {
    return (
      <ul>
        {this.props.data.map(d => (
          <li key={d._id}>
            <A onClick={this.toggleDisplay}>{d._id}</A>
            {this.state.isClicked
              ? <pre>{JSON.stringify(d, null, 2)}</pre>
              : null}
          </li>
        ))}
      </ul>
    );
  }
}

export default createContainer(
  () => {
    const sessions = Sessions.find().fetch();
    const graphs = Graphs.find().fetch();
    const activities = Activities.find().fetch();
    const operators = Operators.find().fetch();
    const connections = Connections.find().fetch();
    return { sessions, graphs, activities, operators, connections };
  },
  ({ sessions, graphs, activities, operators, connections }) => (
    <div id="admin">
      <h1>Commands</h1>
      <button onClick={() => deleteDatabase()}>
        Delete the database
      </button><br />
      <button onClick={() => loadDatabase(argueGraph)}>
        Load argueGraph
      </button><br />
      <button onClick={() => loadDatabase(mixedJigsaw)}>
        Load mixedJigsaw
      </button><br />

      <h1>Graphs</h1>
      <DisplayData data={graphs} />
      <h1>Activities</h1>
      <DisplayData data={activities} />
      <h1>Operators</h1>
      <DisplayData data={operators} />
      <h1>Connections</h1>
      <DisplayData data={connections} />
      <h1>Sessions</h1>
      <DisplayData data={sessions} />
    </div>
  )
);
