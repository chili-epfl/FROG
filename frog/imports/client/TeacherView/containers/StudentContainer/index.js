// @flow

import * as React from 'react';

import { ArrowForwardIos, Person } from '@material-ui/icons';

import { Panel } from '/imports/ui/Sidebar';
import { RowTitle, RowButton } from '/imports/ui/RowItems';

import { OrchestrationContext } from '../../context';

type StepsContainerPropsT = {
  onClick: (id: string) => void
};

export const StudentContainer = (props: StepsContainerPropsT) => {
  const session = React.useContext(OrchestrationContext);

  return (
    <Panel>
      <RowTitle>Students</RowTitle>
      {session.students.map(student => (
        <RowButton
          key={student._id}
          icon={<Person fontSize="small" />}
          onClick={() => props.onClick(student._id)}
        >
          {student.username}
        </RowButton>
      ))}
    </Panel>
  );
};
