// @flow

import * as React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis
} from 'victory';
import { type LogDbT, type ActivityDbT } from '../types';
import { values } from '../toArray';

function sendProgressToCellulo(progress, nbrOfStudents){
  // Unfortunately, using Sessions.findOne (as in ControlButton.js) does not work since import Sessions causes an error "WithVisibility is not a function"
  console.log("progress sent from progress.js")
  try{
    Meteor.call('ws.send', "PROGRESS", ""+progress+":"+nbrOfStudents);
  }catch(err){

  }
}

const Viewer = (props: Object) => {
  const { sendSesMsg, state, activity } = props;
  const nowLine = [
    { x: state.now, y: 0 },
    { x: state.now, y: 1 }
  ];
  const toVictoryFormat = (data, isPred) =>
    (data || []).map((y, i) => {
      const _x = isPred
        ? state.now + i * WINDOW
        : Math.min(state.now, i * WINDOW);
      const _y = y / Math.max(1, state.users);
      return { x: _x, y: _y };
    });


  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
      <VictoryChart style={{ height: '100%' }} theme={VictoryTheme.material}>
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
          data={toVictoryFormat(state.comppred, true)}
        />
        <VictoryLine
          style={{ data: { stroke: '#5454f7', strokeDasharray: '5,5' } }}
          data={toVictoryFormat(state.progpred, true)}
        />
        <VictoryLine
          style={{ data: { stroke: '#b20e0e' } }}
          data={toVictoryFormat(state.completion, false)}
        />
        <VictoryLine
          style={{ data: { stroke: '#0000ff' } }}
          data={toVictoryFormat(state.progress, false)}
        />
        <VictoryLine
          style={{ data: { stroke: 'grey', strokeWidth: 2 } }}
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
      <div>
      <button onClick={() => {sendSesMsg('clasroom progress is ' + state.progress[state.progress.length]); console.log('progress: ' + state.progress.length);}}>
      Send progress to cellulo
      </button>
      <p>Total users: {state.users}</p>
      </div>
    </div>
  );
};

// IN SECONDS!
const WINDOW = 10;
const PREDICT_LENGTH = 300;

// calculate predicted time for each student
const prepareDataForDisplay = (state: Object, activity: ActivityDbT) => {
  const currentTime = activity.actualClosingTime
    ? new Date(activity.actualClosingTime)
    : new Date();
  const currentMaxTime = activity.actualStartingTime
    ? (currentTime - new Date(activity.actualStartingTime)) / 1000
    : state.maxTime;

  const lengthObserved = 1 + Math.ceil(currentMaxTime / WINDOW);
  const lengthPrediction = Math.ceil(PREDICT_LENGTH / WINDOW);

  const progress: number[] = new Array(lengthObserved).fill(0);
  const completion: number[] = new Array(lengthObserved).fill(0);
  const comppred: number[] = new Array(lengthPrediction).fill(0);
  const progpred: number[] = new Array(lengthPrediction).fill(0);

  // compute progress of each student
  values(state.user).forEach(data => {
    if (!data) return;

    //console.log("state has values ")
    //console.log(state) // for a quiz of 16 questions state.user shows { all: [ [ 0, 0.125 ] ] } after answering first question
    //console.log("state has values end")

    //state is of the form
    //{
     // user: { '3mMavApLMFoHmHAva': [ [ 0, 0.165 ], [ 0, 0.413 ] ] }, 
     // maxTime: 0.413
     //}


    //console.log("activity has values")
    //console.log(activity)
    //console.log("activity has values end")

    //console.log("data has values")
    //console.log(data)
    //console.log("data has values end")

    // Compute OBSERVED data
    progress.forEach((_, timeWindow) => {
      const d = data.filter(([___, t]) => t < timeWindow * WINDOW);
      const [p] = d.length > 0 ? d[d.length - 1] : [0]; // p is the first value of array given by d[d.length - 1]
      progress[timeWindow] += p; // last element of array is the progress (print it to check)
      completion[timeWindow] += p < 1 ? 0 : 1;
    });
    sendProgressToCellulo(progress, Object.keys(state.user).length);

    // Compute PREDICTED data
    const [__, startTime] = data[0];
    const [latestP, ___] = data[data.length - 1];
    const _progressRate = latestP / Math.max(1, currentMaxTime - startTime);
    const progressRate = Math.max(Math.min(_progressRate, 1 / 30), 1 / 3600);
    progpred.forEach((_, timeWindow) => {
      const _p = latestP + timeWindow * WINDOW * progressRate;
      const p = Math.min(1, _p);
      progpred[timeWindow] += p;
      comppred[timeWindow] += p < 1 ? 0 : 1;
    });
  });

  return {
    comppred,
    completion,
    progpred,
    progress,
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
  },
  {
    type: 'logs',
    title: 'Valerie 2018 w2 group 1',
    path: '/clientFiles/frog-utils/exampleLogs/progress-unil-valerie1-w2.json',
    activityMerge: {
      actualStartingTime: '2018-12-10T08:32:25.655Z',
      actualClosingTime: '2018-12-10T08:34:54.445Z'
    }
  }
];

export default {
  Viewer,
  mergeLog,
  initData,
  exampleLogs,
  prepareDataForDisplay
};
