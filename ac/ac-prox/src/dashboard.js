// @flow

import React from 'react';
import { CountChart, type LogDBT } from 'frog-utils';

const Viewer = ({ data }: Object) => {
  const d = Object.values(data).reduce(
    (acc, val) => {
      if (val && typeof val === 'number') {
        acc[Math.min(Math.max(0, val), 5)] += 1;
      }
      return acc;
    },
    [0, 0, 0, 0, 0, 0]
  );
  return (
    <CountChart
      title="Number of per group"
      vAxis="Number of student of the group"
      hAxis="Number of groups"
      categories={['0', '1', '2', '3', '4', '>4']}
      data={d}
    />
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'group.create') {
    dataFn.objInsert(1, [log.itemId]);
  }
  if (log.type === 'group.join') {
    dataFn.numIncr(1, [log.itemId]);
  }
  if (log.type === 'group.leave') {
    dataFn.numIncr(-1, [log.itemId]);
  }
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
