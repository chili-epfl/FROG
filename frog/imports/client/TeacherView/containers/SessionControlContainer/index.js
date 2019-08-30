// @flow

import * as React from 'react';

import { Panel } from '/imports/ui/Sidebar';

import { ControlButton } from './ControlButton';

import { OrchestrationContext } from '../../context';

export const SessionControlContainer = () => {
  const session = React.useContext(OrchestrationContext);

  return (
    <Panel>
      {session.isWaitingForStudents ? (
        <ControlButton variant="start" onClick={session.start} />
      ) : session.isDone ? (
        <ControlButton variant="restart" onClick={session.restart} />
      ) : (
        <>
          {session.isPaused ? (
            <ControlButton variant="continue" onClick={session.continue} />
          ) : (
            <ControlButton variant="pause" onClick={session.pause} />
          )}
          {session.singleActivity ? (
            <ControlButton variant="close" onClick={session.next} />
          ) : (
            <ControlButton variant="next" onClick={session.next} />
          )}
        </>
      )}
    </Panel>
  );
};
