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

  let groups;
  if (activity.plane === 2) {
    const object = Objects.findOne(currentActiveSteps[0]._id);
    groups = object?.socialStructure[activity?.groupingKey];
  }

  const studentsByKey = {};
  session.students.forEach(student => (studentsByKey[student._id] = student));

  const groupsView = groups
    ? Object.keys(groups).map((key: string) => (
        <ExpandableList
          expanded={Object.keys(groups)?.length < 5}
          key={key}
          title={key}
        >
          {groups[key].map(id =>
            id !== session.ownerId && studentsByKey[id] ? (
              <RowButton key={id} icon={<Person fontSize="small" />} disabled>
                {studentsByKey[id].username}
              </RowButton>
            ) : null
          )}
        </ExpandableList>
      ))
    : [];

  if (groupsView.length === 0) {
    return (
      <Panel>
        <RowTitle>Students</RowTitle>
        {session.students.map(student =>
          student._id !== session.ownerId ? (
            <RowButton
              key={student._id}
              icon={<Person fontSize="small" />}
              onClick={() => props.onClick(student._id)}
            >
              {student.username}
            </RowButton>
          ) : null
        )}
      </Panel>
    );
  } else {
    return (
      <Panel>
        <RowTitle>Groups</RowTitle>
        {groupsView}
      </Panel>
    );
  }
};
