import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { TimedComponent } from 'frog-utils';

import { Sessions } from '../api/sessions';
import { Activities } from '../api/activities';
import { Products } from '../api/products';

import Runner from './studentView/Runner.jsx';

const setStudentSession = sessionId => {
  Meteor.users.update({ _id: Meteor.userId() }, {
    $set: { 'profile.currentSession': sessionId }
  });
};

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

const ActivityBody = ({ activity, state, products }) => {
  // check if product has been submitted - means completed
  // (might change this to also allow completion of product-less activities)
  if (state !== 'STARTED') {
    return <h1>{state}</h1>;
  }
  if (!activity) {
    return <h1>No activity selected</h1>;
  }
  if (
    products.filter(product => product.activityId === activity._id).length > 0
  ) {
    return <h1>Waiting for next activity</h1>;
  }
  return <Runner activity={activity} />;
};

const SessionBody = TimedComponent(
  ({ session, products, timeNow }) => {
    if (session) {
      const activities = Activities.find({ sessionId: session._id }).fetch();
      const timeUnit = 1000;
      const sessionTime = (timeNow - session.startedAt) / timeUnit;
      const activity = activities.filter(
        ac =>
          ac.startTime < sessionTime && ac.startTime + ac.length > sessionTime
      )[0];
      return activity
        ? <ActivityBody
            activity={activity}
            state={session.state}
            products={products}
          />
        : <p>Wait for an activity {sessionTime}</p>;
    }
    return <p>Please chose a session</p>;
  },
  100
);

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
