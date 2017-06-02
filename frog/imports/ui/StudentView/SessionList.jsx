// @flow

import React from 'react';

import { setStudentSession } from '../../api/sessions';

export default ({ sessions }: { sessions: Array<Object> }) =>
  <div>
    <h3>Session list</h3>
    <ul>
      {sessions.filter(_ => _.state === 'CREATED').map(session =>
        <li key={session._id}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setStudentSession(session._id)}
          >
            Join
          </button>
          {session._id} <i>({session.state}) </i>
        </li>
      )}
    </ul>
  </div>;
