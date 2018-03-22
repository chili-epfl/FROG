// @flow

import * as React from 'react';
import { Chart } from 'react-google-charts';

import {
  type LogT,
  type dashboardViewerPropsT,
  ProgressDashboard,
  LeaderBoard
} from 'frog-utils';

const Viewer = ({ data }: dashboardViewerPropsT) => {
  const { results } = data;
  const options = (title, xLabel, yLabel, ymin, ymax) => ({
    legend: { position: 'none' },
    width: '100%',
    height: '400px',
    vAxis: {
      viewWindowMode: 'explicit',
      viewWindow: {
        max: ymax,
        min: ymin
      },
      title: yLabel
    },
    hAxis: {
      title: xLabel,
      gridlines: { count: 'none' }
    }
  });

  const errRate = o => o.wrong.count / (o.wrong.count + o.correct.count);
  const errData =
    Object.keys(results).length === 0
      ? [new Array(2)]
      : Object.keys(results).map(x => [
          (Number(x) + 3).toString(),
          errRate(results[x])
        ]);

  const avgTime = o =>
    (o.correct.time + o.wrong.time) / (o.correct.count + o.wrong.count);
  const timeData =
    Object.keys(results).length === 0
      ? [new Array(2)]
      : Object.keys(results).map(x => [
          (Number(x) + 3).toString(),
          avgTime(results[x])
        ]);

  return (
    <React.Fragment>
      <Chart
        chartType="LineChart"
        columns={[
          { type: 'string', label: 'Problem' },
          { type: 'number', label: 'Errors' }
        ]}
        rows={errData}
        options={options(
          'Error rate by Difficulty',
          'Difficulty',
          'Error Percentage',
          0,
          1
        )}
      />
      <Chart
        chartType="LineChart"
        columns={[
          { type: 'string', label: 'Problem' },
          { type: 'number', label: 'Time' }
        ]}
        rows={timeData}
        options={options(
          'Timing by Difficulty',
          'Difficulty',
          'Average Time',
          0,
          45000
        )}
      />
    </React.Fragment>
  );
};

const initData = {
  results: {}
};

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { answer, startTime, answerTime, curQuestion } = log.payload;
    const index = curQuestion[1];
    if (!data['results'][index]) {
      if (!answer || !answer.isCorrect) {
        dataFn.objInsert(
          {
            wrong: {
              count: 1,
              time: answerTime - startTime
            },
            correct: {
              count: 0,
              time: 0
            }
          },
          ['results', index]
        );
      } else {
        dataFn.objInsert(
          {
            correct: {
              count: 1,
              time: answerTime - startTime
            },
            wrong: {
              count: 0,
              time: 0
            }
          },
          ['results', index]
        );
      }
    } else if (!answer || !answer.isCorrect) {
      dataFn.numIncr(1, ['results', index, 'wrong', 'count']);
      dataFn.numIncr(answerTime - startTime, [
        'results',
        index,
        'wrong',
        'time'
      ]);
    } else {
      dataFn.numIncr(1, ['results', index, 'correct', 'count']);
      dataFn.numIncr(answerTime - startTime, [
        'results',
        index,
        'correct',
        'time'
      ]);
    }
  }
};

const activityMerge = {
  actualStartingTime: '2018-03-13T07:28:02.833Z',
  actualClosingTime: '2018-03-13T07:34:42.700Z'
};

const exampleLogs = [
  {
    title: 'CS211 week 1',
    path: 'src/logExamples/progress-cs211-w2-2018.json',
    activityMerge,
    instances: 81
  }
];

const resultsDashboard = { Viewer, mergeLog, initData };

export default {
  progress: { ...ProgressDashboard, exampleLogs, activityMerge },
  leaderboard: LeaderBoard,
  results: resultsDashboard
};
