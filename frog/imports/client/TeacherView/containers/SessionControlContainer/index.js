// @flow

import * as React from 'react';

import { ControlButton } from './ControlButton';

import { OrchestrationContext } from '../../context';

export const SessionControlContainer = () => {
  const { sessionState, sessionControl } = React.useContext(
    OrchestrationContext
  );

  return (
    <>
      {sessionState.isWaitingForStudents ? (
        <ControlButton variant="start" onClick={sessionControl.startSession} />
      ) : (
        <ControlButton variant="next" onClick={sessionControl.next} />
      )}
      {sessionState.isPaused ? (
        <ControlButton
          variant="continue"
          onClick={sessionControl.continueSession}
        />
      ) : (
        <ControlButton variant="pause" onClick={sessionControl.pauseSession} />
      )}
    </>
  );
};
