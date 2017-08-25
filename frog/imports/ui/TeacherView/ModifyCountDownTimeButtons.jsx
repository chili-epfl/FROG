// @flow

import React from 'react';
import { msToString } from 'frog-utils';
import { Dropdown, SplitButton, MenuItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';

const ModifyCountDownTimeButtons = ({
  timesTable,
  timeLeft,
  session,
  updateSessionCountdownTimeLeft,
  plusTime,
  setPlus,
  minusTime,
  setMinus,
}: Object) =>
  <div style={{ display: 'flex' }}>
    <SplitButton
      title={'+' + msToString(plusTime)}
      className="btn-success"
      onClick={() =>
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength + plusTime,
        )}
    >
      {timesTable.map(x =>
        <MenuItem
          className="dropdown-item"
          key={x}
          onClick={() => {
            setPlus(x);
            updateSessionCountdownTimeLeft(
              session._id,
              session.countdownLength + x,
            );
          }}
        >
          {' '}{msToString(x)}{' '}
        </MenuItem>,
      )}
    </SplitButton>
    <SplitButton
      title={'+' + msToString(minusTime)}
      className="btn-danger"
      onClick={() =>
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength - minusTime,
        )}
    >
      {timesTable.filter(t => t < timeLeft).map(x =>
        <MenuItem
          className="dropdown-item"
          key={x}
          onClick={() => {
            setMinus(x);
            updateSessionCountdownTimeLeft(
              session._id,
              session.countdownLength - x,
            );
          }}
        >
          {' '}{msToString(x)}{' '}
        </MenuItem>,
      )}
    </SplitButton>
  </div>;

export default compose(
  withState('plusTime', 'setPlus', 30000),
  withState('minusTime', 'setMinus', 30000),
)(ModifyCountDownTimeButtons);
