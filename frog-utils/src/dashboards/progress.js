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
  const { state, activity } = props;
  const nowLine = [{ x: state.now, y: 0 }, { x: state.now, y: 1 }];
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
          { name: 'Completion', symbol: { fill: '#b20e0e' } }
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
        style={{ data: { stroke: '#b20e0e' } }}
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
        data={nowLine}
      />
      <VictoryAxis
        label="Time (sec)"
        domain={[0, activity.length * 60]}
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

const FINISHED = 'finished';
const UPDATE_INTERVAL = 10;
const PREDICT_THRESHOLD = 150;

function linearRegression(activities) {
  const userResult = regression.linear(activities);
  return userResult.equation;
}

function registerUserProgress(userActivities, t) {
  const stateBeforeT = userActivities.filter(value => value[1] <= t);
  const userProgress =
    stateBeforeT.length === 0 ? 0 : stateBeforeT[stateBeforeT.length - 1][0];
  return userProgress;
}

function predictUserProgress(userStatus, t) {
  const userProgress =
    userStatus === FINISHED
      ? 1
      : Math.min((t - userStatus[1]) / userStatus[0], 1);
  return userProgress;
}

function assembleCurve(progress) {
  const curves =
    progress.length === 0
      ? [0, 0]
      : [
          progress.filter(value => value === 1).length / progress.length,
          progress.reduce((a, b) => a + b, 0) / progress.length
        ];
  return curves;
}

const parse = curve =>
  entries(curve).map(([k, v]) => ({ x: parseInt(k, 10), y: v }));

// calculate predicted time for each student
const prepareDataForDisplay = (state: Object, activity: ActivityDbT) => {
  // const currentMaxTime = activity.actualStartingTime
  //   ? (new Date() - new Date(activity.actualStartingTime)) / 1000
  //   : state.maxTime;
  const currentMaxTime = state.maxTime;
  const sessionStatus = {};

  Object.keys(state.user).forEach(user => {
    const userActivities = state.user[user];
    if (userActivities[0][0] !== 0) {
      userActivities.push([0, 0]);
    }
    if (userActivities.length >= 2) {
      const lastIndex = userActivities.length - 1;
      const userStatus = 
        userActivities[lastIndex][0] === 1
          ? FINISHED
          : linearRegression(userActivities);
      sessionStatus[user] = userStatus
    }
  });

  const progressCurve = {};
  const completionCurve = {};
  const predictedProgressCurve = {};
  const predictedCompletionCurve = {};
  const T_MAX = currentMaxTime + PREDICT_THRESHOLD;

  for (let t = 0; t <= T_MAX; t += UPDATE_INTERVAL) {
    const progress = [];
    if (t <= currentMaxTime) {
      // visualize actual data
      Object.keys(state.user).forEach(user => {
        const userProgress = registerUserProgress(state.user[user], t);
        progress.push(userProgress);
      });
      const [comp, prog] = assembleCurve(progress);
      completionCurve[t] = comp;
      predictedCompletionCurve[t] = comp;
      progressCurve[t] = prog;
      predictedProgressCurve[t] = prog;
    } else {
      // predict future data
      Object.keys(sessionStatus).forEach(user => {
        const userProgress = predictUserProgress(sessionStatus[user], t);
        progress.push(userProgress);
      });
      const [comp, prog] = assembleCurve(progress);
      predictedCompletionCurve[t] = comp;
      predictedProgressCurve[t] = prog;
    }
  }

  // interpolate at maxTime
  const progress = [];
  Object.keys(state.user).forEach(user => {
    const userProgress = registerUserProgress(state.user[user], currentMaxTime);
    progress.push(userProgress);
  });
  const [comp, prog] = assembleCurve(progress);
  completionCurve[currentMaxTime] = comp;
  progressCurve[currentMaxTime] = prog;
  predictedProgressCurve[currentMaxTime] = progressCurve[currentMaxTime];
  predictedCompletionCurve[currentMaxTime] = completionCurve[currentMaxTime];

  return {
    prediction: parse(predictedCompletionCurve),
    completion: parse(completionCurve),
    progpred: parse(predictedProgressCurve),
    progress: parse(progressCurve),
    now: currentMaxTime
  };
};

const mergeLog = (state: Object, log: LogDbT, activity?: ActivityDbT) => {
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
  } else if (
    activity &&
    log.type === 'activityDidMount' &&
    activity.actualStartingTime !== undefined &&
    !state.user[log.instanceId]
  ) {
    const startTime =
      (new Date(log.timestamp) - new Date(activity.actualStartingTime)) / 1000;
    state.user[log.instanceId] = [[0, startTime]];
    state.maxTime = startTime;
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
