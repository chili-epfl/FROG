// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
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
  console.log('rerender');

<<<<<<< HEAD
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
=======
  const numWindow = Math.ceil(
    (timeNow - activity.actualStartingTime) / 1000 / TIMEWINDOW
  );
  const timingData = [[0, 0, 0]];
  const factor = 100 / Math.max(Object.keys(instances).length, 1);
  for (let i = 0, j = -1; i <= numWindow; i += 1) {
    if (i * TIMEWINDOW === (data.timing[j + 1] || [0])[0]) {
      j += 1;
    }
    timingData.push([
      i * TIMEWINDOW / 60,
      data.timing[j][1] * factor,
      data.timing[j][2] * factor
    ]);
>>>>>>> b64923fc92565bc48c5fae2b8298e991d2b42e56
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
    const lastIndex = data.timing.length - 1;
    const lastTimingItem = data.timing[lastIndex];
    const prevProgress = data.progress[log.instanceId] || 0;
    const newProgress = lastTimingItem[1] + log.value - prevProgress;
    const didComplete = log.value === 1 && log.value > prevProgress ? 1 : 0;
    const newComplete = lastTimingItem[2] + didComplete;

    dataFn.objInsert(log.value, ['progress', log.instanceId]);

    // $FlowFixMe
    const timeDiff = (log.timestamp - activity.actualStartingTime) / 1000;
    const timeWindow = Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW;

    const toInsert = [timeWindow, newProgress, newComplete];
    if (timeWindow !== lastTimingItem[0]) {
      dataFn.listAppend(toInsert, ['timing']);
    } else {
      dataFn.listReplace(lastTimingItem, toInsert, ['timing', lastIndex]);
    }
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

export default {
  Viewer,
  mergeLog,
  initData
};
