// @flow

import React from 'react';
import { msToString } from 'frog-utils';
import { SplitButton, MenuItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';

const ModifyCountDownTimeButtons = ({
  timesTable,
  timeLeft,
  session,
  updateSessionCountdownTimeLeft,
  plusTime,
  setPlus,
  minusTime,
  setMinus
}: Object) =>
  <div style={{ display: 'flex' }}>
    <SplitButton
      title={'+' + msToString(plusTime)}
      className="btn-success"
      id="dropdown-0"
      onClick={() =>
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength + plusTime
        )}
    >
      {timesTable.map(x =>
        <MenuItem className="dropdown-item" key={x} onClick={() => setPlus(x)}>
          {' '}{msToString(x)}{' '}
        </MenuItem>
      )}
    </SplitButton>
    <SplitButton
      title={'-' + msToString(minusTime)}
      className="btn-danger"
      id="dropdown-1"
      onClick={() => {
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength - minusTime
        );
        if (minusTime > session.countdownLength - minusTime) setMinus(0);
      }}
    >
      {timesTable.filter(t => t < timeLeft).map(x =>
        <MenuItem className="dropdown-item" key={x} onClick={() => setMinus(x)}>
          {' '}{msToString(x)}{' '}
        </MenuItem>
      )}
    </SplitButton>
  </div>;

export default compose(
  withState('plusTime', 'setPlus', 30000),
  withState('minusTime', 'setMinus', 0)
)(ModifyCountDownTimeButtons);
