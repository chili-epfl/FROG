// @flow

import React from 'react';
import styled from 'styled-components';

import {
  removeSession,
  updateSessionState,
  updateSessionCountdownTimeLeft,
  updateSessionCountdownStartTime,
  joinAllStudents,
  restartSession,
} from '../../api/sessions';

import { runSession, nextActivity, setCountdown } from '../../api/engine';

const DEFAULT_TIME_LEFT = 30000;

const ButtonList = ({
  session,
  toggle,
  currentTime,
}: {
  session: Object,
  toggle: Function,
  timeLeft: number,
  setTimeLeft: Function,
}) => {
  const remainingTime =
    session.countdownStartTime + session.countdownTimeLeft - currentTime;

  if (session.countdownStartTime > 0 && remainingTime < 0) {
    updateSessionCountdownStartTime(session._id, -1);
    updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
    nextActivity(session._id);
  }

  const buttons = [
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => {
        runSession(session._id);
        nextActivity(session._id);
      },
      text: 'Start',
    },
    {
      states: ['STARTED'],
      type: 'primary',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
        nextActivity(session._id);
      },
      text: 'Next Activity',
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'primary',
      onClick: toggle,
      text: 'Toggle dashboard/graph view',
    },
    {
      states: ['STARTED'],
      type: 'warning',
      onClick: () => {
        if (session.countdownStartTime !== -1) {
          updateSessionCountdownTimeLeft(
            session._id,
            session.countdownStartTime +
              session.countdownTimeLeft -
              currentTime,
          );
          updateSessionCountdownStartTime(session._id, -2);
        }
        updateSessionState(session._id, 'PAUSED');
      },
      text: 'Pause',
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () => {
        if (session.countdownStartTime !== -1) {
          updateSessionCountdownStartTime(session._id, currentTime);
        }
        updateSessionState(session._id, 'STARTED');
      },
      text: 'Continue',
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
        updateSessionState(session._id, 'STOPPED');
      },
      text: 'Stop',
    },
    {
      states: ['STOPPED'],
      type: 'danger',
      onClick: () => removeSession(session._id),
      text: 'Delete',
    },
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => joinAllStudents(session._id),
      text: 'Join all online students',
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
        restartSession(session);
      },
      text: 'Restart session',
    },
    {
      states: ['STARTED'],
      countdownStarted: false,
      type: 'primary',
      onClick: () => updateSessionCountdownStartTime(session._id, currentTime),
      text: 'Start Countdown',
    },
    {
      states: ['STARTED', 'PAUSED'],
      countdownStarted: true,
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
      },
      text: 'Cancel Countdown',
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'success',
      onClick: () =>
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownTimeLeft + 30000,
        ),
      text: 'Add 30s',
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      {buttons
        .filter(
          button =>
            button.states.indexOf(session.state) > -1 &&
            (button.countdownStarted === undefined ||
              session.countdownStartTime > 0 === button.countdownStarted),
        )
        .map(button =>
          <button
            key={button.text}
            className={'btn btn-' + button.type + ' btn-sm'}
            onClick={button.onClick}
            id={button.text}
          >
            {button.text}
          </button>,
        )}
      {session.state !== 'CREATED' &&
        session.state !== 'STOPPED' &&
        <Countdown>
          {msToString(
            session.countdownStartTime > 0
              ? remainingTime
              : session.countdownTimeLeft,
          )}
        </Countdown>}
    </div>
  );
};

export default ButtonList;

const msToString = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const res =
    minutes > 0
      ? minutes + 'min ' + (Math.round(ms / 1000) - minutes * 60) + 's'
      : Math.round(ms / 1000) + 's';
  return res;
};

const Countdown = styled.div`
  border: solid 2px;
  width: 65px;
  text-align: center;
`;
