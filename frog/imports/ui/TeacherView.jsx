import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import {
  Sessions,
  addSession,
  removeSession,
  updateSessionState,
  updateSessionActivity
} from '../api/sessions';
import { Activities, Operators, addResult } from '../api/activities';
import { Graphs } from '../api/graphs';
import { Logs } from '../api/logs';
import { Products } from '../api/products';

import { runSession } from '../api/engine';

import { activityTypesObj } from '../activityTypes';
import { operatorTypesObj } from '../operatorTypes';

const setTeacherSession = sessionId => {
  Meteor.users.update({ _id: Meteor.userId() }, {
    $set: { 'profile.controlSession': sessionId }
  });
};

// check if there are any operators, and run these first
const runProduct = (sessionId, activityId) => {
  const ops = Operators.find({ to: activityId, type: 'product' }, {
    reactive: false
  }).fetch();
  if (ops.length > 0) {
    const op = ops[0];
    const operatorType = operatorTypesObj[op.operatorType];
    const prod = Products.find({ activityId: op.from }, {
      reactive: false
    }).fetch();
    if (prod.length > 0) {
      const result = operatorType.operator(op.data, prod);
      addResult('product', activityId, result);
    }
  }
};

const runSocial = (sessionId, activityId) => {
  const ops = Operators.find({ to: activityId, type: 'social' }, {
    reactive: false
  }).fetch();
  if (ops.length > 0) {
    const op = ops[0];
    const operatorType = operatorTypesObj[op.operatorType];
    const prod = Products.find({ activityId: op.from }, {
      reactive: false
    }).fetch();
    if (prod.length > 0) {
      const result = operatorType.operator(op.data, prod);
      addResult('social', activityId, result);
    }
  }
};

const switchActivity = (sessionId, activityId) => {
  runProduct(sessionId, activityId);
  runSocial(sessionId, activityId);
  updateSessionActivity(sessionId, activityId);
};

const SessionController = createContainer(
  ({ session }) => {
    const activities = session
      ? Activities.find({ sessionId: session._id }).fetch()
      : null;
    return { session, activities };
  },
  ({ session, activities }) => {
    if (session) {
      return (
        <div>
          <h1>Session control</h1>
          Current state <b>{session.state}</b>.
          Control the session through selecting an activity below,
          or Starting/Pausing/Stopping the session.
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <h3>Available activities</h3>
          <ul>
            {activities.map(activity => {
              const running = activity._id === session.activityId;
              return (
                <li key={activity._id}>
                  <a
                    href="#"
                    onClick={() => switchActivity(session._id, activity._id)}
                  >
                    {activity.title} -
                    <i>{activity.activityType}</i>
                    {!!running && <i> (running)</i>}
                  </a>
                </li>
              );
            })}
          </ul>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => runSession(session._id)}
          >
            Start
          </button>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => updateSessionState(session._id, 'PAUSED')}
          >
            Pause
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => updateSessionState(session._id, 'STOPPED')}
          >
            Stop
          </button>
        </div>
      );
    }
    return (
      <div>
        <h1>Session control</h1>
        <p>Chose a session</p>
      </div>
    );
  }
);

class SessionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphId: this.props.graphs[0] ? this.props.graphs[0]._id : null
    };
  }

  changeGraph = event => {
    event.preventDefault();
    this.setState({ graphId: event.target.value });
  };

  submitAddSession = event => {
    event.preventDefault();
    addSession(this.state.graphId);
  };

  render() {
    return (
      <div>
        <h1>Session list</h1>
        <select onChange={this.changeGraph}>
          {this.props.graphs.map(graph => (
            <option key={graph._id} value={graph._id}>{graph.name}</option>
          ))}
        </select>
        <button
          className="btn btn-primary btn-sm"
          onClick={this.submitAddSession}
        >
          Add session
        </button>
        <ul>
          {this.props.sessions.map(session => (
            <li key={session._id}>
              <a href="#" onClick={() => removeSession(session._id)}>
                <i className="fa fa-times" />
              </a>
              <a href="#" onClick={() => setTeacherSession(session._id)}>
                <i className="fa fa-pencil" />
              </a>
              {session._id}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const DashView = ({ logs, session }) => {
  let Dash = <p>NO DASHBOARD</p>;
  if (session) {
    const activity = Activities.findOne({ _id: session.activity });
    if (activity) {
      const activityType = activityTypesObj[activity.activityType];
      const specificLogs = logs.filter(log => log.activity === activity._id);
      if (activityType && activityType.Dashboard) {
        Dash = (
          <div>
            <p>The current time is {activityType.Dashboard.timeNow}</p>
            <activityType.Dashboard logs={specificLogs} />
          </div>
        );
      }
    }
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {Dash}
    </div>
  );
};

const LogView = createContainer(
  ({ session }) => {
    const logs = session ? Logs.find({ sessionId: session._id }).fetch() : [];
    return { logs };
  },
  ({ logs }) => (
    <div>
      <h1>Logs</h1>
      <ul>
        {logs ? logs.map(log => (
              <li key={log._id}>
                <pre>{JSON.stringify(log, null, 2)}</pre>
              </li>
            )) : <li>NO LOGS</li>}
      </ul>
    </div>
  )
);

export default createContainer(
  () => {
    const user = Meteor.users.findOne({ _id: Meteor.userId() });
    const session = user.profile
      ? Sessions.findOne({ _id: user.profile.controlSession })
      : null;
    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find().fetch(),
      logs: Logs.find({}, { sort: { createdAt: -1 }, limit: 100 }).fetch(),
      user
    };
  },
  ({ graphs, session, sessions, logs }) => (
    <div>
      <SessionController session={session} />
      <DashView session={session} logs={logs} />
      <SessionList sessions={sessions} graphs={graphs} />
      <LogView session={session} />
    </div>
  )
);
