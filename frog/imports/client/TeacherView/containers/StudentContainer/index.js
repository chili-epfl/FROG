// @flow

import * as React from 'react';

import { Person } from '@material-ui/icons';

import { Panel } from '/imports/ui/Sidebar';
import { Objects } from '/imports/api/objects';
import { Activities } from '/imports/api/activities';
import { RowTitle, RowButton } from '/imports/ui/RowItems';
import { ExpandableList } from '/imports/ui/ExpandableList';

import { OrchestrationContext } from '../../context';

type StepsContainerPropsT = {
  onClick: (id: string) => void
};

export const StudentContainer = (props: StepsContainerPropsT) => {
  const session = React.useContext(OrchestrationContext);
  const currentActiveSteps = session.steps.filter(x => x.status === 'active');
  if (currentActiveSteps.length === 0) {
    return null;
  }
  const activity = Activities.findOne(currentActiveSteps[0]._id);
  if (activity.plane === 2) {
    const object = Objects.findOne(currentActiveSteps[0]._id);
    console.info(object?.socialStructure[activity?.groupingKey]);
  }
  return (
    <Panel>
      <RowTitle>Students</RowTitle>
      <ExpandableList title="Group A">
        {session.students.map(student => (
          <RowButton
            key={student._id}
            icon={<Person fontSize="small" />}
            onClick={() => props.onClick(student._id)}
            disabled
          >
            {student.username}
          </RowButton>
        ))}
      </ExpandableList>
    </Panel>
  );
};
