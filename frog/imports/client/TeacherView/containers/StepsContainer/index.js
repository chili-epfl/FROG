// @flow

import * as React from 'react';

import { Panel } from '/imports/ui/Sidebar';
import { ActivityStatus } from '/imports/ui/ActivityStatus';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

type StepsContainerPropsT = {
  onClick: (id: string) => void
};

export const StepsContainer = (props: StepsContainerPropsT) => {
  const session = React.useContext(OrchestrationContext);

  return (
    <Panel>
      <RowTitle>Steps</RowTitle>
      {session.steps.map(step => (
        <RowButton
          key={step._id}
          icon={<ActivityStatus status={step.status} />}
          onClick={() => props.onClick(step._id)}
          disabled={step.status === 'pending'}
        >
          {step.title}
        </RowButton>
      ))}
    </Panel>
  );
};
