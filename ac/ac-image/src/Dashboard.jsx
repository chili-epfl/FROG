// @flow

import React from 'react';
import { CountChart, type LogDBT } from 'frog-utils';

const actionTypes = ['dragdrop.upload', 'webcam.upload', 'vote', 'zoom'];

const Viewer = ({ data }: Object) => {
  const chartData =
    data &&
    actionTypes.map(actionType =>
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
      {chartData &&
        chartData.map((d, i) => (
          <CountChart
            key={actionTypes[i]}
            title={'Number of ' + actionTypes[i] + ' per group'}
            vAxis={'Number of ' + actionTypes[i]}
            hAxis="Number of groups"
            categories={['0', '1', '2', '3', '4', '>4']}
            data={d}
          />
        ))}
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  const action = log.type;
  if (actionTypes.includes(action)) {
    if (!(data && data[log.instanceId])) {
      dataFn.objInsert({ upload: 0, vote: 0, zoom: 0 }, [log.instanceId]);
    }
    dataFn.numIncr(1, [log.instanceId, action]);
  }
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
