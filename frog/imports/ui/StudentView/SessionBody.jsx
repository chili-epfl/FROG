// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Mosaic } from 'react-mosaic-component';
import { Activities } from '../../api/activities';
import { Objects } from '../../api/objects';
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

const SessionBody = ({ activities }: { activities: Object[] }) => {
  // let Body = null;
  // if (!activities || activities.length === 0) {
  //   Body = <h1>No Activity</h1>;
  // } else if (activities.length === 1) {
  //   Body = <Runner activityId={activity[0]} single />;
  // } else {
  //   Body = (
  //     <Mosaic
  //       renderTile={activityId => <Runner activityId={activityId} />}
  //       initialValue={getInitialState(activities)}
  //     />
  //   );
  // }
  // return (
  //   <div style={{ height: '100%' }}>
  //     <Countdown session={session} />
  //     {Body}
  //   </div>
  // );
  //
  return <h1>Hello</h1>;
};

SessionBody.displayName = 'SessionBoday';

export default createContainer(
  () => ({
    sessions: Sessions.find(),
    activities: Activities.find(),
    objects: Objects.find()
  }),
  SessionBody
);
