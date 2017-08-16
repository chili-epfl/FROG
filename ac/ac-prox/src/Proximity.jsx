// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

import HasNoGroupPanel from './NoGroupPanel';
import HasGroupPanel from './GroupPanel';

export default ({ activityData, data, dataFn, userInfo }: ActivityRunnerT) =>
  <div style={{ margin: '5%' }}>
    {data.students.find(x => x.id === userInfo.id) === undefined &&
      <HasNoGroupPanel props={{ activityData, data, dataFn, userInfo }} />}
    {data.students.find(x => x.id === userInfo.id) !== undefined &&
      <HasGroupPanel props={{ data, dataFn, userInfo }} />}
  </div>;
