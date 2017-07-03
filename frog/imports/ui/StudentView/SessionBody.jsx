// @flow

import React from 'react';
import { Mosaic } from 'react-mosaic-component';

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

const SessionBody = ({ session }: { session: Object }) => {
  if (!session.openActivities) {
    return <h1>NO ACTIVITY</h1>;
  }
  if (session.openActivities.length === 1) {
    console.log(session.openActivities);
    return <Runner activityId={session.openActivities[0]} single />;
  } else {
    return (
      <Mosaic
        renderTile={activityId => <Runner activityId={activityId} />}
        initialValue={getInitialState(session.openActivities)}
      />
    );
  }
};

export default SessionBody;
