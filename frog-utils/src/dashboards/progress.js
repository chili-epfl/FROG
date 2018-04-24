// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { type LogDbT, type ActivityDbT } from 'frog-utils';
import regression from 'regression';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis
} from 'victory';
import { entries } from 'lodash';

const Viewer = (props: Object) => {
  const { state } = props;
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryLegend
        x={50}
        y={0}
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: 'black' }, title: { fontSize: 16 } }}
        data={[
          { name: 'Progress', symbol: { fill: '#0000ff' } },
          { name: 'Completion', symbol: { fill: '#6d0909' } }
        ]}
      />
      <VictoryLine
        style={{ data: { stroke: '#f25959', strokeDasharray: '5,5' } }}
        data={state.prediction}
      />
      <VictoryLine
        style={{ data: { stroke: '#5454f7', strokeDasharray: '5,5' } }}
        data={state.progpred}
      />
      <VictoryLine
        style={{ data: { stroke: '#6d0909' } }}
        data={state.completion}
      />
      <VictoryLine
        style={{ data: { stroke: '#0000ff' } }}
        data={state.progress}
      />
      <VictoryLine
        style={{
          data: { stroke: 'grey', strokeWidth: 2 }
        }}
        x={() => state.now}
      />
      <VictoryAxis
        label="Time (sec)"
        style={{
          axisLabel: { fontSize: 14, padding: 30 }
        }}
      />
      <VictoryAxis
        dependentAxis
        label="Class Percentage"
        style={{
          axisLabel: { fontSize: 14, padding: 30 }
        }}
      />
    </VictoryChart>
  );
};

// calculate predicted time for each student
const prepareDataForDisplay = (state: Object) => {
  // assemble predictions
  const predictedTime = [];
  // assemble trained linear regression weights
  const userResultObject = {};
  let currentMaxTime = 0;
  let finishedStudents = 0;
  Object.keys(state).forEach(user => {
    const lastIndex = state[user].length - 1;
    const userMaxTime = state[user][lastIndex][1];
    if (userMaxTime > currentMaxTime) {
      currentMaxTime = userMaxTime;
    }
    let userPredictedTime;
    if (state[user][lastIndex][0] === 1) {
      // already finished - use actual finish time
      userPredictedTime = state[user][lastIndex][1];
      finishedStudents += 1;
    } else if (state[user].length < 3) {
      // finished only less than 2 task - not sufficient
      userPredictedTime = -1;
    } else {
      // finished multiple tasks - linear projection
      const userResult = regression.linear(state[user]);
      userPredictedTime = userResult.equation[0] * 1 + userResult.equation[1];
      userResultObject[user] = userResult.equation;
    }
    if (userPredictedTime !== -1) {
      predictedTime.push(userPredictedTime);
    }
  });
  const predictionCurve = {};
  const completionCurve = {};
  const progpredCurve = {};
  const progressCurve = {};
  const UPDATE_INTERVAL = 20;
  const T_MAX = Math.max(...predictedTime) + UPDATE_INTERVAL;

  for (let t = 0; t <= T_MAX; t += UPDATE_INTERVAL) {
    const filtered = predictedTime.filter(value => value <= t);
    const progress = [];
    Object.keys(state).forEach(user => {
      const filteredProgress = state[user].filter(value => value[1] <= t);
      if (filteredProgress.length !== 0) {
        const lastIndex = filteredProgress.length - 1;
        progress.push(filteredProgress[lastIndex][0]);
      } else {
        progress.push(0);
      }
    });
    if (t <= currentMaxTime) {
      completionCurve[t] =
        progress.filter(value => value === 1).length / progress.length;
      progressCurve[t] = progress.reduce((a, b) => a + b, 0) / progress.length;
      predictionCurve[t] = completionCurve[t];
      progpredCurve[t] = progressCurve[t];
    } else if (userResultObject.length !== 0) {
      predictionCurve[t] = filtered.length / predictedTime.length;
      let predictedProgress = 0;
      Object.keys(userResultObject).forEach(user => {
        if (userResultObject[user] !== 0) {
          predictedProgress += Math.min(
            (t - userResultObject[user][1]) / userResultObject[user][0],
            1
          );
        }
      });
      progpredCurve[t] =
        (predictedProgress + finishedStudents) /
        (Object.keys(userResultObject).length + finishedStudents);
    }
  }
  const parse = curve =>
    entries(curve).map(([k, v]) => ({ x: parseInt(k, 10), y: v }));

  return {
    prediction: parse(predictionCurve),
    completion: parse(completionCurve),
    progress: parse(progressCurve),
    progpred: parse(progpredCurve),
    now: Math.floor(currentMaxTime / UPDATE_INTERVAL) * UPDATE_INTERVAL
  };
};

const mergeLog = (state: Object, log: LogDbT, activity?: ActivityDbT) => {
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
