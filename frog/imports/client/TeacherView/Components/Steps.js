// @flow
import * as React from 'react';

import { NavigateNext } from '@material-ui/icons';
import { Panel } from '/imports/ui/Sidebar';
import { RowButton, RowTitle } from '/imports/ui/RowItems';
import {
  ActivityStatus,
  type ActivityStatusT
} from '/imports/ui/ActivityStatus';

const Step = ({
  title,
  status,
  onClick
}: {
  title: string,
  onClick: Function,
  status: ActivityStatusT
}) => (
  <RowButton
    onClick={onClick}
    icon={<ActivityStatus status={status} />}
    rightIcon={<NavigateNext fontSize="small" />}
  >
    {title}
  </RowButton>
);

const Steps = ({
  steps,
  onClick
}: {
  steps: { title: string, status: ActivityStatusT, _id: string }[],
  onClick?: Function
}) => (
  <Panel>
    <RowTitle>Steps</RowTitle>
    {steps.map(step => (
      <Step
        title={step.title}
        status={step.status}
        onClick={() => {
          if (onClick) {
            onClick(step._id);
          }
        }}
      />
    ))}
  </Panel>
);

// const StepsExample = () => (
//   <Steps
//     steps={[
//       { title: 'Hello', status: 'active', _id: '1' },
//       { title: 'hi', status: 'completed', _id: '2' },
//       { title: 'Hola', status: 'pending', _id: '3' }
//     ]}
//     onClick={e => window.alert(e)}
//   />
// );
export default Steps;
