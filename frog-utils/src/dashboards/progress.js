// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { Chart } from 'react-google-charts';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';

const LineChart = ({
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

const Viewer = TimedComponent((props: Object) => {
  const { data, activity, timeNow } = props;

  const numWindow =
    activity.actualClosingTime === undefined
      ? Math.ceil(
          (new Date(timeNow) - new Date(activity.actualStartingTime)) /
            1000 /
            TIMEWINDOW
        )
      : Math.ceil(
          (new Date(activity.actualClosingTime) -
            new Date(activity.actualStartingTime)) /
            1000 /
            TIMEWINDOW
        );
  const timingData = [[0, 0, 0]];
  const factor = 100 / Math.max(Object.keys(data.progress).length, 1);
  for (let i = 0, j = -1; i <= numWindow; i += 1) {
    while (
      data.timing.length > j + 1 &&
      i * TIMEWINDOW >= (data.timing[j + 1] || [0])[0]
    ) {
      j += 1;
    }
    timingData.push([
      i * TIMEWINDOW / 60,
      data.timing[j][1] * factor,
      data.timing[j][2] * factor
    ]);
  }
  const usersStarted = Object.keys(data.progress).length;
  const usersFinished = Object.keys(data.progress).filter(
    x => data.progress[x] === 1
  ).length;
  return (
    <React.Fragment>
      <LineChart
        title="Activity Progress"
        vAxis="Average Class Progress"
        hAxis="Time Elapsed"
        hLen={props.activity['length']}
        rows={timingData}
      />
      <table>
        <tbody>
          <tr>
            <td style={{ paddingRight: '10px' }}>Users who started activity</td>
            <td>{usersStarted}</td>
          </tr>
          <tr>
            <td style={{ paddingRight: '10px' }}>
              Users who completed activity
            </td>
            <td>{usersFinished}</td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
}, 2000);

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
    let lastIndex = data.timing.length - 1;
    const lastTimingItem = data.timing[lastIndex];

    const prevProgress = data.progress[log.instanceId] || 0;
    const progressIncr = log.value - prevProgress;

    const completeIncr = log.value === 1 && log.value > prevProgress ? 1 : 0;

    dataFn.objInsert(log.value, ['progress', log.instanceId]);

    // $FlowFixMe
    const timeDiff =
      (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
    const timeWindow = Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW;
    if (timeWindow !== lastTimingItem[0]) {
      const newItem = [timeWindow, lastTimingItem[1], lastTimingItem[2]];
      dataFn.listAppend(newItem, ['timing']);
      lastIndex += 1;
    }
    dataFn.numIncr(progressIncr, ['timing', lastIndex, 1]);
    dataFn.numIncr(completeIncr, ['timing', lastIndex, 2]);
  }
};

// progress:
// keyed by instanceId contain the latest logged progress of each instanceId
//
// timing:
// Array of arrays of [ timeWindow, averageProgress, completionRate ]
const initData = {
  progress: {},
  timing: [[0, 0, 0]]
};

const activityMerge = {
  actualStartingTime: '2018-02-20T08:16:05.308Z',
  actualClosingTime: '2018-02-20T08:19:45.140Z'
};

const exampleLogs = [
  {
    title: 'CS211 week 1',
    path: 'frog-utils/src/dashboards/logExamples/progress-cs211-w1.json',
    activityMerge,
    instances: 118
  },
  {
    title: 'CS211 week 1 (n=400)',
    path: 'frog-utils/src/dashboards/logExamples/progress-cs211-w1-short.json',
    activityMerge,
    instances: 118
  },
  {
    title: 'CS211 week 2',
    path: 'frog-utils/src/dashboards/logExamples/progress-cs211-w2-2018.json',
    activityMerge: {
      actualStartingTime: '2018-03-13T07:28:02.833Z',
      actualClosingTime: '2018-03-13T07:34:42.700Z'
    },
    instances: 81
  }
];

export default {
  Viewer,
  mergeLog,
  initData,
  exampleLogs
};
