// @flow

import * as React from 'react';

import { ControlButton } from './ControlButton';

import { OrchestrationContext } from '../../context';

export const SessionControlContainer = () => {
  const session = React.useContext(OrchestrationContext);

  return (
    <>
      {session.isWaitingForStudents ? (
        <ControlButton variant="start" onClick={session.start} />
      ) : (
        <ControlButton variant="next" onClick={session.next} />
      )}
      {session.isPaused ? (
        <ControlButton variant="continue" onClick={session.continue} />
      ) : (
        <ControlButton variant="pause" onClick={session.pause} />
      )}
    </>
  );
};
