// @flow

import * as React from 'react';

import {
  ScatterChart,
  type LogDBT,
  type dashboardViewerPropsT
} from 'frog-utils';

const Viewer = (props: dashboardViewerPropsT) => {
  const { coordinates } = props.data;
  if (!coordinates || Object.keys(coordinates).length < 1) {
    return <p>No data to display</p>;
  } else {
    const noise = c => c.map(x => x + 2 * Math.random() - 1);
    const scatData = Object.keys(coordinates).map(k => noise(coordinates[k]));
    return <ScatterChart data={scatData} />;
  }
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'coordinates' && log.payload) {
    dataFn.objInsert(
      [log.payload.x, log.payload.y],
      ['coordinates', log.instanceId]
    );
  }
};

const initData = {
  coordinates: {}
};

export default { Viewer, mergeLog, initData };
