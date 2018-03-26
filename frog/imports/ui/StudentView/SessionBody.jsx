// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
import { Mosaic } from 'react-mosaic-component';

import { getInitialState } from 'frog-utils';

import { Activities } from '../../api/activities';
import { Sessions } from '../../api/sessions';
import Runner from './Runner';
import Countdown from './Countdown';

const ActivityContainer = ({ activities, sessionId }) => {
  if (activities.length === 1) {
    return <Runner activity={activities[0]} sessionId={sessionId} single />;
  } else {
    return (
      <Mosaic
        renderTile={(activityId, path) => (
          <Runner
            activity={activities.find(x => x._id === activityId)}
            path={path}
            sessionId={sessionId}
          />
        )}
        initialValue={getInitialState(
          sortBy(activities.map(x => x._id), 'activityType')
        )}
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
  if (!activities || !session || activities.length === 0) {
    return <h1>No activity right now</h1>;
  }
  if (session.state === 'PAUSED') {
    return <h1>Paused</h1>;
  }
  return (
    <div style={{ height: '100%' }}>
      {session.countdownStartTime &&
        session.countdownStartTime !== -1 && <Countdown session={session} />}
      <ActivityContainer activities={activities} sessionId={session._id} />
    </div>
  );
};

SessionBody.displayName = 'SessionBody';

export default withTracker(() => ({
  session: Sessions.findOne(),
  activities: Activities.find().fetch()
}))(SessionBody);
