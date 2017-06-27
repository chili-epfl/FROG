// @flow

import React from 'react';

import {
  removeSession,
  updateSessionState,
  joinAllStudents,
  restartSession
} from '../../api/sessions';

import { runSession, nextActivity } from '../../api/engine';

export default ({ session, toggle }: { session: Object, toggle: Function }) => {
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
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => restartSession(session),
      text: 'Restart session'
    }
  ];
  return (
    <div>
      {buttons
        .filter(button => button.states.indexOf(session.state) > -1)
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
    </div>
  );
};
