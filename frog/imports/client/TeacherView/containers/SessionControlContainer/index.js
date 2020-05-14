// @flow

import * as React from 'react';

import { Panel } from '/imports/ui/Sidebar';

import { ControlButton } from './ControlButton';

import { OrchestrationContext } from '../../context';

// in order to have cellulo call next activity ON frog then we must call similarly session.next after packet parsing is done inside api.js 
// this panel needs to be re-rendered when a cellulo command is sent
export const SessionControlContainer = () => {
  const session = React.useContext(OrchestrationContext);
  // use the slug and put the messages here
  console.log('session slug: ' + session.slug);

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
