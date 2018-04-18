// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { Chart } from 'react-google-charts';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';
import regression from 'regression';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLabel } from 'victory';

const Viewer = TimedComponent((props: Object) => {
  const { state } = props;
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLine
        style={{
          data: { stroke: '#b51212' }
        }}
        data={state.prediction}
      />
      <VictoryLine
        style={{
          data: { stroke: '#11b52d' }
        }}
        data={state.progpred}
      />
      <VictoryLine data={state.completion} />
      <VictoryLine data={state.progress} />
      <VictoryLine
        style={{
          data: { stroke: "red", strokeWidth: 2 },
          labels: { angle: -90, fill: "red", fontSize: 20 }
        }}
        labels={["Now"]}
        labelComponent={<VictoryLabel y={100}/>}
        x={() => state.now}
  />
    </VictoryChart>
  );
}, 2000);

// calculate predicted time for each student
const prepareDataForDisplay = state => {
  // assemble predictions
  const predictedTime = [];
  // assemble trained linear regression weights
  const userResultObject = {};
  let currentMaxTime = 0;
  let finishedStudents = 0;
  for (var user in state) {
    var lastIndex = state[user].length - 1;
    const userMaxTime = state[user][lastIndex][1];
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
      var userPredictedTime =
        userResult.equation[0] * 1 + userResult.equation[1];
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

  for (
    var t = 0;
    t <= Math.max(...predictedTime) + UPDATE_INTERVAL;
    t += UPDATE_INTERVAL
  ) {
    const filtered = predictedTime.filter(value => value <= t);
    const progress = [];
    for (var user in state) {
      const filteredProgress = state[user].filter(value => value[1] <= t);
      if (filteredProgress.length != 0) {
        var lastIndex = filteredProgress.length - 1;
        progress.push(filteredProgress[lastIndex][0]);
      } else {
        progress.push(0);
      }
    }
    if (t <= currentMaxTime) {
      completionCurve[t] =
        progress.filter(value => value === 1).length / progress.length;
      progressCurve[t] = progress.reduce((a, b) => a + b, 0) / progress.length;
      predictionCurve[t] = completionCurve[t];
      progpredCurve[t] = progressCurve[t];
    } else if (userResultObject.length != 0) {
      predictionCurve[t] = filtered.length / predictedTime.length;
      let predictedProgress = 0;
      for (var user in userResultObject) {
        if (userResultObject[user] != 0) {
          predictedProgress += Math.min(
            (t - userResultObject[user][1]) / userResultObject[user][0],
            1
          );
        }
      }
      progpredCurve[t] =
        (predictedProgress + finishedStudents) /
        (Object.keys(userResultObject).length + finishedStudents);
    }
  }
  function parse(curve) {
    return Object.keys(curve).map(k => ({ x: parseInt(k), y: curve[k] }));
  }

  return {
    prediction: parse(predictionCurve),
    completion: parse(completionCurve),
    progress: parse(progressCurve),
    progpred: parse(progpredCurve),
    now: Math.floor(currentMaxTime / UPDATE_INTERVAL) * UPDATE_INTERVAL
  };
};

const mergeLog = (state: Object, log: LogDBT, activity?: ActivityDbT) => {
  if (
    activity &&
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    if (!state[log.instanceId]) {
      state[log.instanceId] = [];
    }
    const totalTime =
      (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
    const progress = log.value;
    state[log.instanceId].push([progress, totalTime]);
  }
};

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
