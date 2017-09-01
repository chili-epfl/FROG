// @flow

import React from 'react';
import { Mosaic } from 'react-mosaic-component';
import styled from 'styled-components';
import { msToString } from 'frog-utils';

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

const Countdown = ({ session, currentTime }) => {
  const secondsLeft =
    session.countdownStartTime > 0
      ? Math.round(
          session.countdownStartTime + session.countdownLength - currentTime
        )
      : session.countdownLength;
  return (
    <div>
      {session.countdownStartTime !== -1 &&
        <CountdownDiv>
          <h4>
            {msToString(secondsLeft)}
          </h4>
        </CountdownDiv>}
    </div>
  );
};

const SessionBody = ({
  session,
  currentTime
}: {
  session: Object,
  currentTime: number
}) => {
  if (!session.openActivities || session.openActivities.length === 0) {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} currentTime={currentTime} />
        <h1>NO ACTIVITY</h1>
      </div>
    );
  }
  if (session.openActivities.length === 1) {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} currentTime={currentTime} />
        <Runner activityId={session.openActivities[0]} single />
      </div>
    );
  } else {
    return (
      <div style={{ height: '100%' }}>
        <Countdown session={session} currentTime={currentTime} />
        <Mosaic
          renderTile={activityId => <Runner activityId={activityId} />}
          initialValue={getInitialState(session.openActivities)}
        />
      </div>
    );
  }
};

export default SessionBody;

const CountdownDiv = styled.div`
  border: solid 5px #aa0000;
  background-color: #ff0000;
  border-radius: 30%;
  width: fit-content;
  min-width: 50px;
  height: 50px;
  position: absolute;
  right: 5px;
  text-align: center;
  z-index: 1;
`;
