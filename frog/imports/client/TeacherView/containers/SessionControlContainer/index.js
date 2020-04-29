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
      ) : session.isDone ? null : (
        <>
          {session.singleActivity ? (
            <ControlButton variant="close" onClick={session.next} />
          ) : session.lastActivity ? (
            <ControlButton variant="closeSession" onClick={session.next} />
          ) : (
            <ControlButton variant="next" onClick={session.next} />
          )}
          {session.isPaused ? (
            <ControlButton variant="continue" onClick={session.continue} />
          ) : (
            <ControlButton variant="pause" onClick={session.pause} />
          )}
        </>
      )}
    </Panel>
  );
};
