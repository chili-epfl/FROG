// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { TimeSync } from 'meteor/mizzao:timesync';
import { createContainer } from 'meteor/react-meteor-data';
import { Mosaic } from 'react-mosaic-component';
import styled from 'styled-components';
import { msToString } from 'frog-utils';
import { Operators, Connections } from '../../api/activities';
import { Products } from '../../api/products';

import Runner from './Runner';

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

const CountdownComp = ({ session, currentTime }) => {
  const secondsLeft =
    session.countdownStartTime > 0
      ? Math.round(
          session.countdownStartTime + session.countdownLength - currentTime
        )
      : session.countdownLength;
  return (
    <div>
      {session.countdownStartTime !== -1 &&
        <CountdownDiv>
          <h4>
            {msToString(secondsLeft)}
          </h4>
        </CountdownDiv>}
    </div>
  );
};

const Countdown = createContainer(
  ({ session }) => ({
    currentTime: TimeSync.serverTime(),
    session
  }),
  CountdownComp
);

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

  console.log(struct, activityId);
  if (!struct.all || (struct.list && !struct.list[activityId])) {
    console.log('not found');
    return true;
  }

  const cond = struct.all ? struct.all : struct.list[activityId];
  if (cond.structure === 'individual') {
    const payload = cond.payload[Meteor.userId()];
    console.log(payload);
    if (!payload && cond.mode === 'include') {
      console.log('not, include');
      return false;
    }

    if (payload && cond.mode === 'exclude') {
      console.log('yes, exclude');
      return false;
    }
    console.log('default');
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
  const openActivities = activities.filter(x =>
    checkActivity(x, operators, connections)
  );

  if (!openActivities || openActivities.length === 0) {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} />
        <h1>NO ACTIVITY</h1>
      </div>
    );
  }
  if (openActivities.length === 1) {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} />
        <Runner activityId={openActivities[0]} single />
      </div>
    );
  } else {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} />
        <Mosaic
          renderTile={activityId => <Runner activityId={activityId} />}
          initialValue={getInitialState(openActivities)}
        />
      </div>
    );
  }
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

const CountdownDiv = styled.div`
  border: solid 5px #aa0000;
  background-color: #ff0000;
  border-radius: 30%;
  width: fit-content;
  min-width: 50px;
  height: 50px;
  position: absolute;
  right: 5px;
  text-align: center;
  z-index: 1;
`;
