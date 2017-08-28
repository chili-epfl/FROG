// @flow

import React from 'react';
import styled from 'styled-components';
import { msToString } from 'frog-utils';

import {
  removeSession,
  updateSessionState,
  updateSessionCountdownLength,
  updateSessionCountdownStartTime,
  updateSessionCountdownTimeout,
  meteorSetTimeout,
  meteorClearTimeout,
  joinAllStudents,
  restartSession
} from '../../api/sessions';
import { runSession, nextActivity } from '../../api/engine';

const DEFAULT_COUNTDOWN_LENGTH = 30000;

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

  // if (session.countdownStartTime > 0 && remainingTime < 0) {
  //   updateSessionCountdownStartTime(session._id, -1);
  //   updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH[1]);
  //   nextActivity(session._id);
  // }

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
        updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
        meteorClearTimeout(session._id);
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
          updateSessionCountdownLength(
            session._id,
            session.countdownStartTime + session.countdownLength - currentTime
          );
          updateSessionCountdownStartTime(session._id, -2);
        }
        updateSessionState(session._id, 'PAUSED');
        meteorClearTimeout(session._id);
      },
      text: 'Pause'
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () => {
        if (session.countdownStartTime !== -1) {
          updateSessionCountdownStartTime(session._id, currentTime);
          // updateSessionCountdownTimeout(
          //   session._id,
          meteorSetTimeout(
            session._id,
            () => {
              updateSessionCountdownStartTime(session._id, -1);
              updateSessionCountdownLength(
                session._id,
                DEFAULT_COUNTDOWN_LENGTH
              );
              nextActivity(session._id);
            },
            session.countdownLength
          );
          // );
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
        updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
        meteorClearTimeout(session._id);
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
        updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
        meteorClearTimeout(session._id);
        restartSession(session);
      },
      text: 'Restart session'
    },
    {
      states: ['STARTED'],
      countdownStarted: false,
      type: 'primary',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, currentTime);
        // updateSessionCountdownTimeout(
        //   session._id,
        meteorSetTimeout(
          session._id,
          () => {
            updateSessionCountdownStartTime(session._id, -1);
            updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
            nextActivity(session._id);
          },
          session.countdownLength
        );
        // );
      },
      text: 'Start Countdown'
    },
    {
      states: ['STARTED', 'PAUSED'],
      countdownStarted: true,
      type: 'danger',
      onClick: () => {
        updateSessionCountdownStartTime(session._id, -1);
        updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
        meteorClearTimeout(session._id);
      },
      text: 'Cancel Countdown'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'success',
      onClick: () => {
        updateSessionCountdownLength(
          session._id,
          session.countdownLength + DEFAULT_COUNTDOWN_LENGTH
        );
        meteorClearTimeout(session._id);
        // updateSessionCountdownTimeout(
        //   session._id,
        meteorSetTimeout(
          session._id,
          () => {
            updateSessionCountdownStartTime(session._id, -1);
            updateSessionCountdownLength(session._id, DEFAULT_COUNTDOWN_LENGTH);
            nextActivity(session._id);
          },
          session.countdownLength
        );
        // );
      },
      text: '+30s'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        if (session.countdownLength > DEFAULT_COUNTDOWN_LENGTH) {
          updateSessionCountdownLength(
            session._id,
            session.countdownLength - DEFAULT_COUNTDOWN_LENGTH
          );
          meteorClearTimeout(session._id);
          // updateSessionCountdownTimeout(
          //   session._id,
          meteorSetTimeout(
            session._id,
            () => {
              updateSessionCountdownStartTime(session._id, -1);
              updateSessionCountdownLength(
                session._id,
                DEFAULT_COUNTDOWN_LENGTH
              );
              nextActivity(session._id);
            },
            session.countdownLength
          );
          // );
        }
      },
      text: '-30s'
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
        <Countdown>
          {msToString(
            session.countdownStartTime > 0
              ? remainingTime
              : session.countdownLength
          )}
        </Countdown>}
    </div>
  );
};

export default ButtonList;

const Countdown = styled.div`
  border: solid 2px;
  width: 65px;
  text-align: center;
`;
