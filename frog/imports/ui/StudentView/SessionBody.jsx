// @flow

import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { sortBy } from 'lodash';
import { Mosaic } from 'react-mosaic-component';
import styled from 'styled-components';

import { Activities } from '../../api/activities';
import { Sessions } from '../../api/sessions';
import Runner from './Runner';
import Countdown from './Countdown';

const getInitialState = (activities, d = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]._id
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d)
      };
};

const ActivityContainer = ({ activities, sessionId }) => {
  if (activities.length === 1) {
    return <Runner activity={activities[0]} sessionId={sessionId} single />;
  } else {
    return (
      <Mosaic
        renderTile={(activityid, path) => (
          <Runner
            activity={activities.find(x => x._id === activityid)}
            path={path}
            sessionId={sessionId}
          />
        )}
        initialValue={getInitialState(sortBy(activities, 'activityType'))}
      />
    );
  }
};

const DashLink = styled.div`
  position: fixed;
  bottom: 0px;
  right: 0px;
  font-size: 3em;
  color: black;
`;

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
  if (session.state === 'PAUSED') {
    return <h1>Paused</h1>;
  }
  return (
    <React.Fragment>
      <div style={{ height: '100%' }}>
        {session.countdownStartTime && <Countdown session={session} />}
        <ActivityContainer activities={activities} sessionId={session._id} />
      </div>
      <div className="bootstrap">
        <DashLink>
          <a
            href="/"
            target="_blank"
            className="glyphicon glyphicon-dashboard"
          />
        </DashLink>
      </div>
    </React.Fragment>
  );
};

SessionBody.displayName = 'SessionBody';

export default withTracker(() => ({
  session: Sessions.findOne(),
  activities: Activities.find().fetch()
}))(SessionBody);
