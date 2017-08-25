// @flow

import React from 'react';
import styled from 'styled-components';
import { msToString } from 'frog-utils';

import {
  removeSession,
  updateSessionState,
  updateSessionCountdownTimeLeft,
  updateSessionCountdownStartTime,
  joinAllStudents,
  restartSession
} from '../../api/sessions';
import { runSession, nextActivity } from '../../api/engine';
import ModifyCountDownTimeButtons from './ModifyCountDownTimeButtons';

const DEFAULT_COUNTDOWN_LENGTH = [10000, 30000, 60000, 300000];

const ButtonList = ({
  session,
  toggle,
  currentTime
}: {
  session: Object,
  toggle: Function,
  currentTime: number
}) => {
  const remainingTime =
    session.countdownStartTime + session.countdownLength - currentTime;

  if (session.countdownStartTime > 0 && remainingTime < 0) {
    updateSessionCountdownStartTime(session._id, -1);
    updateSessionCountdownTimeLeft(session._id, DEFAULT_COUNTDOWN_LENGTH[1]);
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
      text: 'Start'
    },
    {
      states: ['STARTED'],
      type: 'primary',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH[1]
        );
        nextActivity(session._id);
      },
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
      onClick: () => {
        if (session.countdownStartTime !== -1) {
          updateSessionCountdownTimeLeft(
            session._id,
            session.countdownStartTime + session.countdownLength - currentTime
          );
          updateSessionCountdownStartTime(session._id, -2);
        }
        updateSessionState(session._id, 'PAUSED');
      },
      text: 'Pause'
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
      text: 'Continue'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH[1]
        );
        updateSessionState(session._id, 'STOPPED');
      },
      text: 'Stop'
    },
    {
      states: ['STOPPED'],
      type: 'danger',
      onClick: () => removeSession(session._id),
      text: 'Delete'
    },
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => joinAllStudents(session._id),
      text: 'Join all online students'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH[1]
        );
        restartSession(session);
      },
      text: 'Restart session'
    },
    {
      states: ['STARTED'],
      countdownStarted: false,
      type: 'primary',
      onClick: () => updateSessionCountdownStartTime(session._id, currentTime),
      text: 'Start Countdown'
    },
    {
      states: ['STARTED', 'PAUSED'],
      countdownStarted: true,
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownTimeLeft(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH[1]
        );
      },
      text: 'Cancel Countdown'
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
        .map(button =>
          <button
            key={button.text}
            className={'btn btn-' + button.type + ' btn-sm'}
            onClick={button.onClick}
            id={button.text}
          >
            {button.text}
          </button>
        )}
      {session.state !== 'CREATED' &&
        session.state !== 'STOPPED' &&
        <div style={{ display: 'flex' }}>
          <ModifyCountDownTimeButtons
            timesTable={DEFAULT_COUNTDOWN_LENGTH}
            timeLeft={
              session.countdownStartTime > 0
                ? Math.round(
                    session.countdownStartTime +
                      session.countdownLength -
                      currentTime
                  )
                : session.countdownLength
            }
            session={session}
            updateSessionCountdownTimeLeft={updateSessionCountdownTimeLeft}
          />
          <Countdown>
            {msToString(
              session.countdownStartTime > 0
                ? remainingTime
                : session.countdownLength
            )}
          </Countdown>
        </div>}
    </div>
  );
};

export default ButtonList;

const Countdown = styled.div`
  border: solid 2px;
  width: 65px;
  text-align: center;
`;
