// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Mosaic } from 'react-mosaic-component';
import { Activities } from '../../api/activities';
import { Sessions } from '../../api/sessions';

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

const ActivityContainer = ({ activities }) => {
  if (activities.length === 1) {
    return <Runner activity={activities[0]} single />;
  } else {
    return (
      <Mosaic
        renderTile={activity => <Runner activity={activity} />}
        initialValue={getInitialState(activities)}
      />
    );
  }
};

const SessionBody = ({
  activities,
  session
}: {
  activities: Object[],
  session: Object
}) => {
  if (!activities || activities.length === 0) {
    return <h1>No Activity</h1>;
  }
  return (
    <div style={{ height: '100%' }}>
      {session.countdownStartTime && <Countdown session={session} />}
      <ActivityContainer activities={activities} />
    </div>
  );
};

SessionBody.displayName = 'SessionBoday';

export default createContainer(
  () => ({
    session: Sessions.findOne(),
    activities: Activities.find().fetch()
  }),
  SessionBody
);
