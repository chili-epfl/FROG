// @flow

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { addSession, setTeacherSession } from '../../api/sessions';

export default (
  { graphs, sessions }: { graphs: Array<Object>, sessions: Array<Object> }
) => (
  <div>
    <h1>Session list</h1>
    <DropdownButton title="Create Session" id="dropdown-basic-0">
      {graphs && graphs.length
        ? graphs.map(graph => (
            <MenuItem
              key={graph._id}
              eventKey={graph._id}
              onClick={() => addSession(graph._id)}
            >
              {graph.name}
            </MenuItem>
          ))
        : <MenuItem eventKey="0">No graph</MenuItem>}
    </DropdownButton>
    <ul>
      {sessions.map(session => (
        <li key={session._id}>
          <a href="#" onClick={() => setTeacherSession(session._id)}>
            {session._id}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
