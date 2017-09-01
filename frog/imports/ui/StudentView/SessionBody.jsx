// @flow

import React from 'react';
import { Mosaic } from 'react-mosaic-component';

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

const SessionBody = ({ session }: { session: Object }) => {
  let Body = null;
  if (!session.openActivities || session.openActivities.length === 0) {
    Body = <h1>No Activity</h1>;
  } else if (session.openActivities.length === 1) {
    Body = <Runner activityId={session.openActivities[0]} single />;
  } else {
    Body = (
      <Mosaic
        renderTile={activityId => <Runner activityId={activityId} />}
        initialValue={getInitialState(session.openActivities)}
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

export default SessionBody;
