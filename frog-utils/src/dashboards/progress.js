// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { Chart } from 'react-google-charts';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';
import regression from 'regression';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory'

const TIMEWINDOW = 5;

const Viewer = TimedComponent((props: Object) => {
  const { state } = props;
  return (
    <VictoryChart theme={VictoryTheme.material} >
      <VictoryLine 
        style={{
          data: { stroke: "#b51212"}
        }}
        data={state.prediction}/>
      <VictoryLine 
        style={{
          data: { stroke: "#11b52d"}
        }}
        data={state.progpred}/>
      <VictoryLine data={state.completion}/>
      <VictoryLine data={state.progress}/>
    </VictoryChart>
  );
}, 2000);

// calculate predicted time for each student
const prepareDataForDisplay = (state) => {
  // predictions
  const predictedTime = [];
  const userResultObject = {};
  var currentMaxTime = 0;
  var finishedStudents = 0;
  for (var user in state) {
    var lastIndex = state[user].length - 1;
    var userMaxTime = state[user][lastIndex][1];
    if (userMaxTime > currentMaxTime) {
      currentMaxTime = userMaxTime;
    }
    if (state[user][lastIndex][0] === 1) {
      // already finished - use actual finish time
      var userPredictedTime = state[user][lastIndex][1];
      finishedStudents += 1;      
    } else if (state[user].length < 3) {
      // finished only less than 2 task - not sufficient
      var userPredictedTime = -1;
    } else {
      // finished multiple tasks - linear projection
      const userResult = regression.linear(state[user]);
      var userPredictedTime = userResult.equation[0] * 1 + userResult.equation[1];
      userResultObject[user] = userResult.equation;
    }
    if (userPredictedTime != -1) {
      predictedTime.push(userPredictedTime);
    }
  } 
  const predictionCurve = {};
  const completionCurve = {};
  const progpredCurve = {};
  const progressCurve = {}; 
  const UPDATE_INTERVAL = 20;
  for (var t = 0; t <= Math.max(...predictedTime) + UPDATE_INTERVAL; t += UPDATE_INTERVAL) {
    var filtered = predictedTime.filter(value => value <= t)
    var progress = [];
    for (var user in state) {
      var filteredProgress = state[user].filter(value => value[1] <= t)
      if (filteredProgress.length != 0) {
        var lastIndex = filteredProgress.length - 1;
        progress.push(filteredProgress[lastIndex][0])
      } else {
        progress.push(0)
      }
    }
    if (t < currentMaxTime) {
      completionCurve[t] = progress.filter(value => value === 1).length / progress.length;
      progressCurve[t] = progress.reduce(function(a, b){ return a + b; }) / progress.length;
      predictionCurve[t] = completionCurve[t]
      progpredCurve[t] = progressCurve[t]
    } else if (userResultObject.length != 0) {
      predictionCurve[t] = (filtered.length / predictedTime.length);
      var predictedProgress = 0
      for (var user in userResultObject) {
        if (userResultObject[user] != 0) {
          predictedProgress += Math.min(((t - userResultObject[user][1]) / userResultObject[user][0]), 1)
        }  
      }
      progpredCurve[t] = (predictedProgress + finishedStudents) / (Object.keys(userResultObject).length + finishedStudents);
    }

  }
  function parse(curve) {
    return Object.keys(curve).map(k => ({ x: parseInt(k), y: curve[k]}))
  }

  return {
    prediction: parse(predictionCurve),
    completion: parse(completionCurve),
    progress: parse(progressCurve),
    progpred: parse(progpredCurve)
  }
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
    if(!state[log.instanceId]) {
      state[log.instanceId] = []
    }
    const totalTime = (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
    const progress = log.value
    state[log.instanceId].push([ progress, totalTime ])
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
const initData = {};

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
  exampleLogs,
  prepareDataForDisplay
};
