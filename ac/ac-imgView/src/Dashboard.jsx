// @flow

import React from 'react';
import { CountChart } from 'frog-utils';

const actionTypes = ['upload', 'vote', 'zoom']

const Viewer = ({ data }: Object) => {
  const chartData = data && actionTypes.map(actionType =>
    Object.keys(data).reduce(
      (acc, val) => {
        const count = data[val] ? data[val][actionType] : -1;
        if (Number.isInteger(count) && count > -1) {
          acc[Math.min(Math.max(0, count), 5)] += 1;
        }
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    )
  );
  return (
    <div>
      {chartData && chartData.map((d, i) =>
        <CountChart
          key={actionTypes[i]}
          title={"Number of " + actionTypes[i] + " per group"}
          vAxis={"Number of " + actionTypes[i]}
          hAxis="Number of groups"
          categories={['0', '1', '2', '3', '4', '>4']}
          data={d}
        />
      )}
    </div>
  );
};

const mergeLog = (
  data: any,
  dataFn: Object,
  { instanceId, payload }: { instanceId: string, payload: any }
) => {
  const action = payload.split('/')[0]
  if(actionTypes.includes(action)){
    if (!(data && data[instanceId])) {
      dataFn.objInsert({ upload: 0, vote: 0, zoom: 0 }, [instanceId]);
    }
    dataFn.numIncr(1, [instanceId, action]);
  }
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
