// @flow

import React from 'react';
import { Mosaic } from 'react-mosaic-component';
import styled from 'styled-components';

import { setCountdown } from '../../api/engine';
import Runner from './Runner';

const getInitialState = (activities, d = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d),
      };
};

const SessionBody = ({ session, currentTime }: { session: Object }) => {
  const remainingTime = Math.round(
    (session.countdownStartTime + session.countdownTimeLeft - currentTime) /
      1000,
  );

  const minutes = Math.floor(remainingTime / 60);
  const remainingString =
    minutes > 0
      ? minutes + 'min ' + (remainingTime - minutes * 60) + 's'
      : remainingTime + 's';

  if (!session.openActivities || session.openActivities.length === 0) {
    return (
      <div>
        {session.countdownStartTime > 0 &&
          <Countdown>
            <h4>
              {remainingString}
            </h4>
          </Countdown>}
        <h1>NO ACTIVITY</h1>
      </div>
    );
  }
  if (session.openActivities.length === 1) {
    return (
      <div>
        {session.countdownStartTime > 0 &&
          <Countdown>
            <h4>
              {remainingString}
            </h4>
          </Countdown>}
        <Runner activityId={session.openActivities[0]} single />
      </div>
    );
  } else {
    console.log(session.countdownStartTime > 0);
    return (
      <div>
        {session.countdownStartTime > 0 &&
          <Countdown>
            <h4>
              {remainingString}
            </h4>
          </Countdown>}
        <Mosaic
          renderTile={activityId => <Runner activityId={activityId} />}
          initialValue={getInitialState(session.openActivities)}
        />
      </div>
    );
  }
};

export default SessionBody;

const Countdown = styled.div`
  border: solid 5px #aa0000;
  background-color: #ff0000;
  border-radius: 100%;
  width: 90px;
  height: 60px;
  position: absolute;
  top: 5px;
  right: 5px;
  text-align: center;
  padding-top: 5px;
  z-index: 1;
`;
