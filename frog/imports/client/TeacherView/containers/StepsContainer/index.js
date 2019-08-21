// @flow

import * as React from 'react';

import { Panel } from '/imports/ui/Sidebar';
import { ActivityStatus } from '/imports/ui/ActivityStatus';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

export const StepsContainer = () => {
  const session = React.useContext(OrchestrationContext);

  return (
    <Panel>
      <RowTitle>Steps</RowTitle>
      {session.steps.map(step => (
        <RowButton icon={<ActivityStatus status={step.status} />}>
          {step.title}
        </RowButton>
      ))}
    </Panel>
  );
};
