// @flow

import * as React from 'react';

import { ArrowForwardIos } from '@material-ui/icons';

import { Panel } from '/imports/ui/Sidebar';
import { ActivityStatus } from '/imports/ui/ActivityStatus';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

type StepsContainerPropsT = {
  activeId: ?string,
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
          rightIcon={
            step.status !== 'pending' ? (
              <ArrowForwardIos fontSize="small" />
            ) : (
              undefined
            )
          }
          onClick={() => props.onClick(step._id)}
          disabled={step.status === 'pending'}
          active={step._id === props.activeId}
        >
          {step.title}
        </RowButton>
      ))}
    </Panel>
  );
};
