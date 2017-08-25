// @flow

import React from 'react';
import { msToString } from 'frog-utils';
import { Dropdown, MenuItem } from 'react-bootstrap';

const ModifyCountDownTimeButtons = ({
  timesTable,
  timeLeft,
  session,
  updateSessionCountdownTimeLeft
}: Object) =>
  <div style={{ display: 'flex' }}>
    <Dropdown>
      <Dropdown.Toggle className="btn btn-success">
        <span
          className="glyphicon glyphicon-plus"
          style={{ fontSize: '10px', top: '-1px' }}
        />{' '}
        <span className="glyphicon glyphicon-time" />{' '}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {timesTable.map(x =>
          <MenuItem
            className="dropdown-item"
            key={x}
            onClick={() =>
              updateSessionCountdownTimeLeft(
                session._id,
                session.countdownLength + x
              )}
          >
            {' '}{msToString(x)}{' '}
          </MenuItem>
        )}
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown>
      <Dropdown.Toggle className="btn btn-danger">
        <span
          className="glyphicon glyphicon-minus"
          style={{ fontSize: '10px', top: '-1px' }}
        />{' '}
        <span className="glyphicon glyphicon-time" />{' '}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {timesTable.filter(t => t < timeLeft).map(x =>
          <MenuItem
            className="dropdown-item"
            key={x}
            onClick={() =>
              updateSessionCountdownTimeLeft(
                session._id,
                session.countdownLength - x
              )}
          >
            {' '}{msToString(x)}{' '}
          </MenuItem>
        )}
      </Dropdown.Menu>
    </Dropdown>
  </div>;

export default ModifyCountDownTimeButtons;
