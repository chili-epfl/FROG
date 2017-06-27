// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { addSession, setTeacherSession } from '../../api/sessions';

export default ({
  graphs,
  sessions
}: {
  graphs: Array<Object>,
  sessions: Array<Object>
}) =>
  <div style={{ display: 'flex' }}>
    <DropdownButton
      style={{ marginRight: '50px' }}
      title="Create Session"
      id="dropdown-basic-0"
    >
      {graphs && graphs.length
        ? graphs.filter(x => !x.sessionId).map(graph =>
            <MenuItem
              key={graph._id}
              eventKey={graph._id}
              onClick={() => addSession(graph._id)}
            >
              {graph.name}
            </MenuItem>
          )
        : <MenuItem eventKey="0">No graph</MenuItem>}
    </DropdownButton>
    <DropdownButton title="Switch Session" id="dropdown-basic-1">
      {sessions.map(session =>
        <MenuItem
          key={session._id}
          eventKey={session._id}
          onClick={() => setTeacherSession(session._id)}
        >
          {session.name}
        </MenuItem>
      )}
    </DropdownButton>
  </div>;
