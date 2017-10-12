// @flow

import React from 'react';
import styled from 'styled-components';
import { msToString } from 'frog-utils';
import { TimeSync } from 'meteor/mizzao:timesync';
import { createContainer } from 'meteor/react-meteor-data';

import {
  removeSession,
  updateSessionState,
  sessionStartCountDown,
  sessionCancelCountDown,
  sessionChangeCountDown,
  restartSession,
  makeDebug
} from '../../api/sessions';
import { runSession, nextActivity } from '../../api/engine';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const CountdownDiv = styled.div`
  border: solid 2px;
  width: 65px;
  text-align: center;
`;

const CountdownPure = ({ startTime, length, currentTime }) => {
  const remainingTime = startTime + length - currentTime;
  return (
    <CountdownDiv>
      {msToString(startTime > 0 ? remainingTime : length)}
    </CountdownDiv>
  );
};

const Countdown = createContainer(
  props => ({ ...props, currentTime: TimeSync.serverTime() }),
  CountdownPure
);

const ButtonList = ({
  session,
  toggle
}: {
  session: Object,
  toggle: Function
}) => {
  const buttons = [
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => {
        runSession(session._id);
        nextActivity(session._id);
      },
      text: 'Start'
    },
    {
      states: ['STARTED'],
      type: 'primary',
      onClick: () => nextActivity(session._id),
      text: 'Next Activity'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'primary',
      onClick: toggle,
      text: 'Toggle dashboard/graph view'
    },
    {
      states: ['STARTED'],
      type: 'warning',
      onClick: () =>
        updateSessionState(session._id, 'PAUSED', TimeSync.serverTime()),
      text: 'Pause'
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () =>
        updateSessionState(session._id, 'STARTED', TimeSync.serverTime()),
      text: 'Continue'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => updateSessionState(session._id, 'STOPPED'),
      text: 'Stop'
    },
    {
      states: ['STOPPED'],
      type: 'danger',
      onClick: () => removeSession(session._id),
      text: 'Delete'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => makeDebug(session._id),
      text: 'Make session debug'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => restartSession(session),
      text: 'Restart session'
    },
    {
      states: ['STARTED'],
      countdownStarted: false,
      type: 'primary',
      onClick: () => sessionStartCountDown(session._id, TimeSync.serverTime()),
      text: 'Start Countdown'
    },
    {
      states: ['STARTED', 'PAUSED'],
      countdownStarted: true,
      type: 'danger',
      onClick: () => sessionCancelCountDown(session._id),
      text: 'Cancel Countdown'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'success',
      onClick: () =>
        sessionChangeCountDown(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH,
          TimeSync.serverTime()
        ),
      text: '+' + msToString(DEFAULT_COUNTDOWN_LENGTH)
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        if (session.countdownLength > DEFAULT_COUNTDOWN_LENGTH) {
          sessionChangeCountDown(
            session._id,
            0 - DEFAULT_COUNTDOWN_LENGTH,
            TimeSync.serverTime()
          );
        }
      },
      text: '-' + msToString(DEFAULT_COUNTDOWN_LENGTH)
    }
  ];
  return (
    <div style={{ display: 'flex' }}>
      {buttons
        .filter(
          button =>
            button.states.indexOf(session.state) > -1 &&
            (button.countdownStarted === undefined ||
              session.countdownStartTime > 0 === button.countdownStarted)
        )
        .map(button => (
          <button
            key={button.text}
            className={'btn btn-' + button.type + ' btn-sm'}
            onClick={button.onClick}
            id={button.text}
          >
            {button.text}
          </button>
        ))}
      {session.state !== 'CREATED' &&
        session.state !== 'STOPPED' && (
          <Countdown
            startTime={session.countdownStartTime}
            length={session.countdownLength}
          />
        )}
      <b style={{ marginLeft: '20px' }}>
        session: <a href={`/${session.slug}`}>{session.slug}</a>
      </b>
    </div>
  );
};

export default ButtonList;
