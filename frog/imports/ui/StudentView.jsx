import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Sessions, setStudentSession } from '../api/sessions';
import { Activities } from '../api/activities';
import { Products } from '../api/products';
import { Objects } from '../api/objects';

import Runner from './studentView/Runner.jsx';

const SessionList = ({ sessions, curSessionId }) => (
  <div>
    <h3>Session list</h3>
    <ul>
      {sessions.map(session => (
        <li key={session._id}>
          {session._id === curSessionId
            ? '(current): '
            : <button
                className="btn btn-primary btn-sm"
                onClick={() => setStudentSession(session._id)}
              >
                Join
              </button>}
          {session._id} <i>({session.state}) </i>
        </li>
      ))}
    </ul>
  </div>
);

const ActivityBody = createContainer(
  props => {
    const o = Objects.findOne({ activityId: props.activity._id });
    return {
      ...props,
      object: o ? o.data : null
    };
  },
  ({ activity, state, object }) => {
    // check if product has been submitted - means completed
    // (might change this to also allow completion of product-less activities)
    if (state !== 'STARTED') {
      return <h1>{state}</h1>;
    }
    if (!activity) {
      return <h1>No activity selected</h1>;
    }
    return <Runner activity={activity} object={object} />;
  }
);

const SessionBody = ({ session, products }) => {
  if (session) {
    const activity = Activities.findOne({ _id: session.activityId });
    return activity
      ? <ActivityBody
          activity={activity}
          state={session.state}
          products={products}
        />
      : <p>Waiting for an activity</p>;
  }
  return <p>Please chose a session</p>;
};

const StudentView = ({ user, sessions, products }) => {
  const curSession = user.profile
    ? Sessions.findOne({ _id: user.profile.currentSession })
    : null;
  return (
    <div>
      <SessionBody session={curSession} products={products} />
      <SessionList
        sessions={sessions}
        curSessionId={!!curSession && curSession._id}
      />
    </div>
  );
};

export default createContainer(
  () => {
    const sessions = Sessions.find().fetch();
    const user = Meteor.users.findOne({ _id: Meteor.userId() });
    const products = Products.find({ userId: Meteor.userId() }).fetch();
    return { sessions, user, products };
  },
  StudentView
);
