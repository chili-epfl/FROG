// @flow

import React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { compose, withState, withHandlers } from 'recompose';

import { Activities } from '../../api/activities';
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

export const withTitle = compose(
  withState('title', 'setTitle', ''),
  withHandlers({
    setTitle: ({ setTitle }) => e => setTitle(n => e)
  })
);

const SessionBody = ({ session, setTitle, title }: { session: Object }) =>
  session.openActivities && session.openActivities.length > 0
    ? <Mosaic
        renderTile={activityId =>
          <MosaicWindow
            title={Activities.findOne(activityId).title + title}
            style={{ overflow: 'auto' }}
          >
            <Runner activityId={activityId} setTitle={setTitle} />
          </MosaicWindow>}
        initialValue={getInitialState(session.openActivities)}
      />
    : <h1>NO ACTIVITY</h1>;

export default withTitle(SessionBody);
