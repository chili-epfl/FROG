// @flow

import React from 'react';

import {
  removeSession,
  updateSessionState,
  updateSessionCountdownTimeLeft,
  updateSessionCountdownStartTime,
  joinAllStudents,
  restartSession,
} from '../../api/sessions';

import { runSession, nextActivity, setCountdown } from '../../api/engine';

const DEFAULT_TIME_LEFT = 30;

const ButtonList = ({
  session,
  toggle,
  timeLeft,
  setTimeLeft,
}: {
  session: Object,
  toggle: Function,
  timeLeft: number,
  setTimeLeft: Function,
}) => {
  if (
    session.countdownStartTime > 0 &&
    (TimeSync.serverTime() - session.countdownStartTime) / 1000 <
      session.countdownTimeLeft
  ) {
    updateSessionCountdownStartTime(session._id, -1);
    updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
    nextActivity(session._id);
  }
  console.log(session);
  console.log(session.countdownStartTime);
  console.log(session.countdownTimeLeft);
  console.log(updateSessionCountdownStartTime);
  console.log(updateSessionCountdownTimeLeft);

  const buttons = [
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => {
        runSession(session._id);
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
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
        if (session.countdownStartTime != -1) {
          updateSessionCountdownTimeLeft(
            TimeSync.serverTime() - session.countdownStartTime,
          );
        }
        updateSessionState(session._id, 'PAUSED');
      },
      text: 'Pause',
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () => {
        if (session.countdownStartTime != -1) {
          updateSessionCountdownStartTime(session._id, TimeSync.serverTime());
        }
        updateSessionState(session._id, 'STARTED');
      },
      text: 'Continue',
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        if (session.countdownStartTime != -1) {
          updateSessionCountdownTimeLeft(
            TimeSync.serverTime() - session.countdownStartTime,
          );
        }
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
      onClick: () =>
        updateSessionCountdownStartTime(session._id, TimeSync.serverTime()),
      text: 'Start Countdown',
    },
    {
      states: ['STARTED', 'PAUSED'], // //////////// Not implemented
      countdownStarted: true,
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(session._id, DEFAULT_TIME_LEFT);
      },
      text: 'Cancel Countdown',
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'success',
      onClick: () =>
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownTimeLeft + 30,
        ),
      text: 'Add 30s',
    },
  ];
  return (
    <div>
      {buttons
        .filter(
          button =>
            button.states.indexOf(session.state) > -1 &&
            (button.countdownState === undefined ||
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
      <div style={{ border: 'solid 2px', width: 'fit-content' }}>
        {session.countdownStartTime > 0
          ? session.countdownTimeLeft -
            session.countdownStartTime -
            TimeSync.serverTime()
          : session.countdownTimeLeft}
      </div>
    </div>
  );
};

export default ButtonList;
