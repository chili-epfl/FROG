// @flow

import React from 'react';
import { CountChart, type structureDefT } from 'frog-utils';

const Viewer = ({ data }: Object) => {
  const d =
    data &&
    Object.keys(data).reduce(
      (acc, val) => {
        const count = data[val] ? data[val].upload : -1;
        if (Number.isInteger(count) && count > -1) {
          acc[Math.min(Math.max(0, count), 5)] += 1;
        }
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    );
  return (
    <CountChart
      title={'Number of group per number of submission'}
      categories={['0', '1', '2', '3', '4', '>4']}
      data={d}
    />
  );
};

const mergeLog = (
  data: any,
  dataFn: Object,
  { instanceId, payload }: { instanceId: string, payload: any }
) => {
  dataFn.numIncr(1, [instanceId, payload]);
};

const initData = (
  dataFn: Object,
  structure: structureDefT,
  groups: string[]
) => {
  groups.forEach(g => {
    dataFn.objInsert({ upload: 0, vote: 0 }, [g]);
  });
};

export default {
  Viewer,
  mergeLog,
  initData
};
