// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { type LogDBT, type ActivityDbT, TimedComponent } from 'frog-utils';
import regression from 'regression';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis
} from 'victory';

const Viewer = TimedComponent((props: Object) => {
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
}, 2000);

const FINISHED_STATUS = true;
const NOT_SUFFICIENT_STATUS = false;
const UPDATE_INTERVAL = 20;
const PREDICT_THRESHOLD = 150;

function linearRegression(userdata) {
  const userResult = regression.linear(userdata);
  return userResult.equation;
}

function parse(curve) {
  return Object.keys(curve).map(k => ({ x: parseInt(k, 10), y: curve[k] }));
}

// calculate predicted time for each student
const prepareDataForDisplay = (state: Object) => {
  const predStatus = {};

  Object.keys(state.user).forEach(user => {
    let lastIndex = state.user[user].length - 1;
    let userStatus = (state.user[user][lastIndex][0] === 1) ?
      FINISHED_STATUS : (state.user[user].length < 2) ?
        NOT_SUFFICIENT_STATUS : linearRegression(state.user[user]);
    predStatus[user] = userStatus
  });

  const progressCurve = {};
  const completionCurve = {};
  const predictedProgressCurve = {};
  const predictedCompletionCurve = {};

  const T_MAX = state.maxTime + PREDICT_THRESHOLD;

  for (let t = 0; t <= T_MAX; t += UPDATE_INTERVAL) {
    const progress = [];
    if (t <= state.maxTime) {
      // visualize actual data
      Object.keys(state.user).forEach(user => {
        let stateBeforeT = state.user[user].filter( value => value[1] <= t );
        if (stateBeforeT.length === 0) {
          progress.push(0)
        } else {
          let lastIndex = stateBeforeT.length - 1;
          progress.push(stateBeforeT[lastIndex][0]);
        }
      });

      if (progress.length === 0) {
        completionCurve[t] = 0
        progressCurve[t] = 0
      } else {
        completionCurve[t] = progress.filter( value => value === 1 ).length / progress.length;
        progressCurve[t] = progress.reduce((a, b) => a + b, 0) / progress.length;
      }
      predictedProgressCurve[t] = progressCurve[t];
      predictedCompletionCurve[t] = completionCurve[t];
    } else {
      // predict future data
      Object.keys(predStatus).forEach(user => {
        if (predStatus[user] === FINISHED_STATUS) {
          progress.push(1);
        } else if (predStatus[user] != NOT_SUFFICIENT_STATUS) {
          progress.push(Math.min((t - predStatus[user][1]) / predStatus[user][0], 1));
        }
      });
      if (progress.length === 0) {
        predictedCompletionCurve[t] = 0;
        predictedProgressCurve[t] = 0;
      } else {
        predictedCompletionCurve[t] = progress.filter( value => value === 1 ).length / progress.length;
        predictedProgressCurve[t] = progress.reduce((a, b) => a + b, 0) / progress.length;
      }
    }
  }

  // interpolate at maxTime
  const progress = [];
  Object.keys(state.user).forEach(user => {
    let stateBeforeT = state.user[user].filter( value => value[1] <= state.maxTime );
    if (stateBeforeT.length === 0) {
      progress.push(0)
    } else {
      let lastIndex = stateBeforeT.length - 1;
      progress.push(stateBeforeT[lastIndex][0]);
    }
  });

  if (progress.length === 0) {
    completionCurve[state.maxTime] = 0
    progressCurve[state.maxTime] = 0
  } else {
    completionCurve[state.maxTime] = progress.filter( value => value === 1 ).length / progress.length;
    progressCurve[state.maxTime] = progress.reduce((a, b) => a + b, 0) / progress.length;
  }
  predictedProgressCurve[state.maxTime] = progressCurve[state.maxTime];
  predictedCompletionCurve[state.maxTime] = completionCurve[state.maxTime];

  return {
    prediction: parse(predictedCompletionCurve),
    completion: parse(completionCurve),
    progpred: parse(predictedProgressCurve),
    progress: parse(progressCurve),
    now: Math.floor(state.maxTime / UPDATE_INTERVAL) * UPDATE_INTERVAL
  };
};

const mergeLog = (state: Object, log: LogDBT, activity?: ActivityDbT) => {
  if (
    activity &&
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    if (!state.user[log.instanceId]) {
      state.user[log.instanceId] = [];
    }
    const totalTime =
      (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
    const progress = log.value;
    state.user[log.instanceId].push([progress, totalTime]);
    state.maxTime = totalTime;
  }
};

const initData = {
  user: {},
  maxTime: 0
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
  exampleLogs,
  prepareDataForDisplay
};
