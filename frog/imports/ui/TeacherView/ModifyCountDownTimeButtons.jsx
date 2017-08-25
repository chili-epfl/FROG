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
  updateSessionCountdownTimeout,
  plusTime,
  setPlus,
  minusTime,
  setMinus,
}: Object) =>
  <div style={{ display: 'flex' }}>
    <SplitButton
      title={'+' + msToString(plusTime)}
      className="btn-success"
      id="dropdown-0"
      onClick={() => {
        Meteor.clearTimeout(session.timeoutId);
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength + plusTime,
        );
        updateSessionCountdownTimeout(
          session._id,
          Meteor.setTimeout(() => {
            updateSessionCountdownStartTime(session._id, -1);
            updateSessionCountdownTimeLeft(
              session._id,
              DEFAULT_COUNTDOWN_LENGTH[1],
            );
            nextActivity(session._id);
          }, session.countdownLength),
        );
      }}
    >
      {timesTable.map(x =>
        <MenuItem className="dropdown-item" key={x} onClick={() => setPlus(x)}>
          {' '}{msToString(x)}{' '}
        </MenuItem>,
      )}
    </SplitButton>
    <SplitButton
      title={'-' + msToString(minusTime)}
      className="btn-danger"
      id="dropdown-1"
      onClick={() => {
        Meteor.clearTimeout(session.timeoutId);
        updateSessionCountdownTimeLeft(
          session._id,
          session.countdownLength - minusTime,
        );
        updateSessionCountdownTimeout(
          session._id,
          Meteor.setTimeout(() => {
            updateSessionCountdownStartTime(session._id, -1);
            updateSessionCountdownTimeLeft(
              session._id,
              DEFAULT_COUNTDOWN_LENGTH[1],
            );
            nextActivity(session._id);
          }, session.countdownLength),
        );
        if (minusTime > session.countdownLength - minusTime) setMinus(0);
      }}
    >
      {timesTable.filter(t => t < timeLeft).map(x =>
        <MenuItem className="dropdown-item" key={x} onClick={() => setMinus(x)}>
          {' '}{msToString(x)}{' '}
        </MenuItem>,
      )}
    </SplitButton>
  </div>;

export default compose(
  withState('plusTime', 'setPlus', 30000),
  withState('minusTime', 'setMinus', 0),
)(ModifyCountDownTimeButtons);
