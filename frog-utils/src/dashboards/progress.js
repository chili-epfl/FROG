// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { Chart } from 'react-google-charts';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';
import regression from 'regression'

const TIMEWINDOW = 5;

const Viewer = TimedComponent((props: Object) => {
  const { state } = props;

  return (
    <p>{JSON.stringify(state,null,2)}</p>
  );
}, 2000);

const prepareDataForDisplay = (state) => {
  console.log(state)
  return state
  // const numWindow =
  //   activity.actualClosingTime === undefined
  //     ? Math.ceil(
  //         (new Date(timeNow) - new Date(activity.actualStartingTime)) /
  //           1000 /
  //           TIMEWINDOW
  //       )
  //     : Math.ceil(
  //         (new Date(activity.actualClosingTime) -
  //           new Date(activity.actualStartingTime)) /
  //           1000 /
  //           TIMEWINDOW
  //       );
  // const timingData = [[0, 0, 0, 0]];
  // const factor = 100 / Math.max(Object.keys(state.progress).length, 1);
  // for (let i = 0, j = -1; i <= numWindow; i += 1) {
  //   while (
  //     state.timing.length > j + 1 &&
  //     i * TIMEWINDOW >= (state.timing[j + 1] || [0])[0]
  //   ) {
  //     j += 1;
  //   }
  //   // making predictions
  //   // this 'data' object is made out of nowhere and subject to change
  //   const predictedTime = [];
  //   for (u = 0; u < data.users.length; u++) {
  //     if (Math.max(data.users[u].progress) === 1) {
  //       const userPredictedTime = Math.max(data.users[u].totalTime); // get max time
  //     } else {
  //       const userData = [];
  //       for (e = 0; e < data.users[u].progress.length; e++) {
  //         userData.push([data.users[u].totalTime[e], data.users[u].progress[e]]);
  //       }
  //       const userResult = regression.linear(userData);
  //       const userPredictedTime = userResult.predict[1];
  //     }
  //     predictedTime.push(userPredictedTime);
  //   }
  //   // pass plot info to timingData
  //   predictedTime.filter(x => predictedTime < i).length

  //   timingData.push([
  //     i * TIMEWINDOW / 60,
  //     state.timing[j][1] * factor,
  //     state.timing[j][2] * factor,
  //     predictedTime * factor // prediction info
  //   ]);
  // }
  // const usersStarted = Object.keys(state.progress).length;
  // const usersFinished = Object.keys(state.progress).filter(
  //   x => state.progress[x] === 1
  // ).length;
  // return timingData
}

const mergeLog = (state: Object, log: LogDBT, activity?: ActivityDbT) => {
  if (
    activity &&
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    console.log(state)
    console.log(log)
    if(!state[log.instanceId]) {
      state[log.instanceId] = []
    }
    const totalTime = activity.actualStartingTime - log.timestamp
    const progress = log.value
    state[log.instanceId].push([ totalTime, progress ])
  }
  // ) {
  //   let lastIndex = state.timing.length - 1;
  //   const lastTimingItem = state.timing[lastIndex];

  //   const prevProgress = state.progress[log.instanceId] || 0;
  //   const progressIncr = log.value - prevProgress;

  //   const completeIncr = log.value === 1 && log.value > prevProgress ? 1 : 0;

  //   state.progress[log.instanceId] = log.value;

  //   const timeDiff =
  //     (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
  //   const timeWindow = Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW;
  //   if (timeWindow !== lastTimingItem[0]) {
  //     const newItem = [timeWindow, lastTimingItem[1], lastTimingItem[2]];
  //     state.timing.push(newItem);
  //     lastIndex += 1;
  //   }
  //   state.timing[lastIndex][1] += progressIncr;
  //   state.timing[lastIndex][2] += completeIncr;
};

// progress:
// keyed by instanceId contain the latest logged progress of each instanceId
//
// timing:
// Array of arrays of [ timeWindow, averageProgress, completionRate ]
const initData = {
  users: {}
};

const activityMerge = {
  actualStartingTime: '2018-02-20T08:16:05.308Z',
  actualClosingTime: '2018-02-20T08:19:45.140Z'
};

const exampleLogs = [
  {
    title: 'CS211 week 1 (n=400)',
    path: 'frog-utils/src/dashboards/logExamples/progress-cs211-w1-short.json',
    activityMerge,
    instances: 118
  },
  {
    title: 'CS211 week 1',
    path: 'frog-utils/src/dashboards/logExamples/progress-cs211-w1.json',
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
