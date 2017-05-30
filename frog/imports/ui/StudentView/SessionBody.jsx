// @flow

import React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';

import Runner from './Runner.jsx';

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

const SessionBody = ({ session }: { session: Object }) =>
  session.openActivities && session.openActivities.length > 0
    ? <Mosaic
        renderTile={activityId => (
          <MosaicWindow title={'We can add titles here'}>
            <Runner activityId={activityId} />
          </MosaicWindow>
        )}
        initialValue={getInitialState(session.openActivities)}
      />
    : <h1>NO ACTIVITY</h1>;

export default SessionBody;
