// @flow

import React from 'react';

import {
  removeSession,
  updateSessionState,
  joinAllStudents
} from '../../api/sessions';

import { runSession, nextActivity } from '../../api/engine';

export default ({ session }: { session: Object }) => {
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
      states: ['STARTED'],
      type: 'warning',
      onClick: () => updateSessionState(session._id, 'PAUSED'),
      text: 'Pause'
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () => updateSessionState(session._id, 'STARTED'),
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
      states: ['CREATED'],
      type: 'primary',
      onClick: () => joinAllStudents(session._id),
      text: 'Join all online students'
    }
  ];
  return (
    <div>
      {buttons
        .filter(button => button.states.indexOf(session.state) > -1)
        .map(button => (
          <button
            key={button.text}
            className={'btn btn-' + button.type + ' btn-sm'}
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
    </div>
  );
};
