// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Chart } from 'react-google-charts';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';

export const LineChart = ({
  title,
  vAxis,
  hAxis,
  hLen,
  rows
}: {
  title: string,
  vAxis: string,
  hAxis: string,
  hLen: number,
  rows: Array<Array<number>>
}) => (
  <Chart
    chartType="LineChart"
    rows={rows}
    columns={[
      { type: 'number', label: 'Time' },
      { type: 'number', label: 'Progress' },
      { type: 'number', label: 'Complete' }
    ]}
    width="100%"
    height="300px"
    options={{
      title,
      legend: { position: 'top' },
      pointSize: 5,
      vAxis: {
        title: vAxis,
        minValue: 0,
        maxValue: 100,
        viewWindow: { max: 100 },
        gridlines: { color: 'transparent' }
      },
      hAxis: {
        title: hAxis,
        minValue: 0,
        maxValue: hLen,
        gridlines: { color: 'transparent' }
      }
    }}
  />
);

const TIMEWINDOW = 5;
let timingData;

const Viewer = TimedComponent((props: Object) => {
  const { data, instances, activity, timeNow } = props;

  if (activity.actualClosingTime === undefined) {
    const numWindow = Math.ceil(
      (timeNow - activity.actualStartingTime) / 1000 / TIMEWINDOW
    );
    timingData = [[0, 0, 0]];
    const factor = 100 / Object.keys(instances).length;
    for (let i = 0, j = -1; i <= numWindow; i += 1) {
      if (i * TIMEWINDOW === (data['timing'][j + 1] || [0])[0]) {
        j += 1;
      }
      timingData.push([
        i * TIMEWINDOW / 60,
        data['timing'][j][1] * factor,
        data['timing'][j][2] * factor
      ]);
    }
  }
  return (
    <LineChart
      title="Activity Progress"
      vAxis="Average Class Progress"
      hAxis="Time Elapsed"
      hLen={props.activity['length']}
      rows={timingData}
    />
  );
}, TIMEWINDOW * 1000);

const mergeLog = (
  data: any,
  dataFn: Object,
  log: LogDBT,
  activity?: ActivityDbT
) => {
  if (
    activity &&
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    const progDiff =
      (data['timing'][data['timing'].length - 1][1] || 0) +
      log.value -
      (data.progress[log.instanceId] || 0);
    const complete =
      log.value === 1 && log.value - (data.progress[log.instanceId] || 0) !== 0
        ? 1
        : 0;
    dataFn.objInsert(log.value, ['progress', log.instanceId]);

    // $FlowFixMe
    const timeDiff = (log.timestamp - activity.actualStartingTime) / 1000;

    if (
      Math.ceil(timeDiff / TIMEWINDOW) !==
      data['timing'][data['timing'].length - 1][0] / TIMEWINDOW
    ) {
      dataFn.listAppend(
        [
          Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW,
          progDiff,
          data['timing'][data['timing'].length - 1][2] + complete
        ],
        'timing'
      );
    } else {
      data['timing'][data['timing'].length - 1] = [
        Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW,
        progDiff,
        data['timing'][data['timing'].length - 1][2] + complete
      ];
      dataFn.objInsert(data['timing'], 'timing');
    }
  }
};

const initData = {
  progress: {},
  timing: [[0, 0, 0]]
};

export default {
  Viewer,
  mergeLog,
  initData
};
