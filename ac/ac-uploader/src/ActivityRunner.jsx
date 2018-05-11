// @flow

import React from 'react';
import { withState } from 'recompose';
import type { ActivityRunnerPropsT } from 'frog-utils';

import Presentation from './Presentation';
import UploadPanel from './UploadPanel';
import List from './List';

const ActivityRunner = (
  props: ActivityRunnerPropsT & { done: boolean, setDone: Function }
) => {
  const { activityData, data, dataFn, done } = props;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Presentation activityData={activityData} />
      {!done && [
        <UploadPanel key="panel" {...props} />,
        <List key="list" data={data} dataFn={dataFn} />
      ]}
    </div>
  );
};

export default withState('done', 'setDone', false)(ActivityRunner);
