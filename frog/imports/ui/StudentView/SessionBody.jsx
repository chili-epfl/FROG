// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Mosaic } from 'react-mosaic-component';
import { Operators, Connections } from '../../api/activities';
import { Products } from '../../api/products';

import Runner from './Runner';
import Countdown from './Countdown';

const getInitialState = (activities, d = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d)
      };
};

const checkActivity = (activityId, operators, connections) => {
  const connectedNodes = connections
    .filter(x => x.target.id === activityId)
    .map(x => x.source.id);
  const controlOp = operators.find(x => connectedNodes.includes(x._id));
  if (!controlOp) {
    return true;
  }

  const structraw = Products.findOne(controlOp._id);
  const struct = structraw && structraw.controlStructure;
  if (!struct) {
    return true;
  }

  if (struct.list && !struct.list[activityId]) {
    return true;
  }

  const cond = struct.all ? struct.all : struct.list[activityId];
  if (cond.structure === 'individual') {
    const payload = cond.payload[Meteor.userId()];
    if (!payload && cond.mode === 'include') {
      return false;
    }

    if (payload && cond.mode === 'exclude') {
      return false;
    }
    return true;
  }
};

const SessionBody = ({
  session,
  operators,
  connections
}: {
  session: Object,
  operators: Object[],
  connections: Object[]
}) => {
  const activities = session.openActivities;
  const openActivities =
    activities &&
    activities.filter(x => checkActivity(x, operators, connections));
  let Body = null;
  if (!openActivities || openActivities.length === 0) {
    Body = <h1>No Activity</h1>;
  } else if (openActivities.length === 1) {
    Body = <Runner activityId={openActivities[0]} single />;
  } else {
    Body = (
      <Mosaic
        renderTile={activityId => <Runner activityId={activityId} />}
        initialValue={getInitialState(openActivities)}
      />
    );
  }
  return (
    <div style={{ height: '100%' }}>
      <Countdown session={session} />
      {Body}
    </div>
  );
};

SessionBody.displayName = 'SessionBoday';

export default createContainer(
  ({ session }) => ({
    connections: Connections.find({ graphId: session.graphId }).fetch(),
    operators: Operators.find({
      graphId: session.graphId,
      type: 'control'
    }).fetch(),
    session
  }),
  SessionBody
);
