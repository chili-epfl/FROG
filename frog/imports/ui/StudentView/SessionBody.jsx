// @flow

import React from 'react';
import { Mosaic } from 'react-mosaic-component';

import { setCountdown } from '../../api/engine';
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
  //{session.countdownOn &&
  //   window.alert('Only 5 seconds left')
  // }
  if (session.countdownOn) {
    window.alert('Only 5 seconds left');
    setCountdown(session._id, false);
  }
  if (!session.openActivities || session.openActivities.length === 0) {
    return <h1>NO ACTIVITY</h1>;
  }
  if (session.openActivities.length === 1) {
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
