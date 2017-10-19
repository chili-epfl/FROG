// @flow

import React from 'react';
import { withState } from 'recompose';
import type { ActivityRunnerT } from 'frog-utils';

import Presentation from './Presentation';
import UploadPanel from './UploadPanel';
import List from './List';

const ActivityRunner = (
  props: ActivityRunnerT & { done: boolean, setDone: Function }
) => {
  const { activityData, data, dataFn, done } = props;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Presentation activityData={activityData} />
      {!done && (
        <div
          style={{
            transform: 'translateY(100px)'
          }}
        >
          <UploadPanel {...props} />
          <List data={data} dataFn={dataFn} />
        </div>
      )}
    </div>
  );
};

export default withState('done', 'setDone', false)(ActivityRunner);
