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
    <React.Fragment>
      <VictoryChart style={{height: calc('100vh - 50px)'}} theme={VictoryTheme.material}>
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
      <p>Total users: {state.users}</p>
    </React.Fragment>
  );
};

const FINISHED = 'finished';
const UPDATE_THRESHOLD = 10;
const HIATUS_THRESHOLD = 90;
const PREDICT_THRESHOLD = 150;
const MAX_NUM_INTERVAL = 100;

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
      : userStatus[0] === 0
        ? Math.min(userStatus[1], 1)
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

const hiatusCoefficient = progress => Math.exp(1 - 2 * progress);

// calculate predicted time for each student
const prepareDataForDisplay = (state: Object, activity: ActivityDbT) => {
  const currentTime = activity.actualClosingTime
    ? new Date(activity.actualClosingTime)
    : new Date();
  const currentMaxTime = activity.actualStartingTime
    ? (currentTime - new Date(activity.actualStartingTime)) / 1000
    : state.maxTime;
  const sessionStatus = {};

  Object.keys(state.user).forEach(user => {
    const userActivities = state.user[user];
    if (userActivities[0][0] !== 0) {
      userActivities.unshift([0, 0]);
    }
    const lastIndex = userActivities.length - 1;
    if (lastIndex >= 1) {
      const userStatus =
        userActivities[lastIndex][0] === 1
          ? FINISHED
          : currentMaxTime - userActivities[lastIndex][1] <
            Math.max(
              HIATUS_THRESHOLD,
              hiatusCoefficient(userActivities[lastIndex][0]) *
                (userActivities[lastIndex][1] - userActivities[0][1])
            )
            ? linearRegression(userActivities)
            : [0, userActivities[lastIndex][0]]; // student in hiatus stops working, returns final progress
      sessionStatus[user] = userStatus;
    }
  });

  const progressCurve = {};
  const completionCurve = {};
  const predictedProgressCurve = {};
  const predictedCompletionCurve = {};
  const T_MAX = currentMaxTime + PREDICT_THRESHOLD;
  const UPDATE_INTERVAL = Math.max(
    UPDATE_THRESHOLD,
    Math.ceil(T_MAX / MAX_NUM_INTERVAL)
  );

  for (let t = 0; t <= T_MAX; t += UPDATE_INTERVAL) {
    const progress = [];
    if (t <= currentMaxTime) {
      // visualize actual data
      Object.keys(sessionStatus).forEach(user => {
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
  Object.keys(sessionStatus).forEach(user => {
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
    now: currentMaxTime,
    users: Object.keys(state.user).length
  };
};

const mergeLog = (state: Object, log: LogDbT, activity?: ActivityDbT) => {
  if (!activity || !activity.actualStartingTime) {
    return;
  }
  const diff = (a, b) => (a && b ? (new Date(a) - new Date(b)) / 1000 : 0);
  if (log.type === 'progress') {
    state.user[log.instanceId] = state.user[log.instanceId] || [];
    const userArray = state.user[log.instanceId];
    const totalTime = diff(log.timestamp, activity.actualStartingTime);
    const _progress = typeof log.value === 'number' ? log.value : 0;
    const _last = userArray[userArray.length - 1];
    const _previous = _last ? _last[0] : 0;
    const progress = Math.max(_previous, _progress);
    userArray.push([progress, totalTime]);
    state.maxTime = totalTime;
  } else if (log.type === 'activityDidMount' && !state.user[log.instanceId]) {
    const startTime = diff(log.timestamp, activity.actualStartingTime);
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
    type: 'logs',
    title: 'CS211 week 1 (n=400)',
    path: '/clientFiles/frog-utils/exampleLogs/progress-cs211-w1-short.json',
    activityMerge,
    instances: 118
  },
  {
    type: 'logs',
    title: 'CS211 week 1',
    path: '/clientFiles/frog-utils/exampleLogs/progress-cs211-w1.json',
    activityMerge,
    instances: 118
  },
  {
    type: 'logs',
    title: 'CS211 week 2',
    path: '/clientFiles/frog-utils/exampleLogs/progress-cs211-w2-2018.json',
    activityMerge: {
      actualStartingTime: '2018-03-13T07:28:02.833Z',
      actualClosingTime: '2018-03-13T07:34:42.700Z'
    },
    instances: 81
  },
  {
    type: 'logs',
    title: 'Stroop girls 1',
    path: '/clientFiles/frog-utils/exampleLogs/stroop_girls_1.json',
    activityMerge: {
      actualStartingTime: '2018-08-22T09:26:52Z',
      actualClosingTime: '2018-08-22T09:28:35Z'
    },
    instances: 2
  },
  {
    type: 'logs',
    title: 'Stroop girls 2',
    path: '/clientFiles/frog-utils/exampleLogs/stroop_girls_2.json',
    activityMerge: {
      actualStartingTime: '2018-08-22T09:54:48Z',
      actualClosingTime: '2018-08-22T09:55:59Z'
    },
    instances: 2
  }
];

export default {
  Viewer,
  mergeLog,
  initData,
  exampleLogs,
  prepareDataForDisplay
};
