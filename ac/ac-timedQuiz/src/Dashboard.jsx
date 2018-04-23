// @flow

import * as React from 'react';
import { Chart } from 'react-google-charts';

import {
  type LogT,
  type DashboardViewerPropsT,
  ProgressDashboard,
  LeaderBoard
} from 'frog-utils';

const Viewer = ({ state }: DashboardViewerPropsT) => {
  const { results } = state;
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

const mergeLog = (state: any, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { answer, startTime, answerTime, curQuestion } = log.payload;
    const index = curQuestion[1];
    if (!state['results'][index]) {
      if (!answer || !answer.isCorrect) {
        state.results[index] = {
          wrong: {
            count: 1,
            time: answerTime - startTime
          },
          correct: {
            count: 0,
            time: 0
          }
        };
      } else {
        state.results[index] = {
          correct: {
            count: 1,
            time: answerTime - startTime
          },
          wrong: {
            count: 0,
            time: 0
          }
        };
      }
    } else if (!answer || !answer.isCorrect) {
      state.results[index].wrong.count += 1;
      state.results[index].wrong.time += answerTime - startTime;
    } else {
      state.results[index].correct.count += 1;
      state.results[index].correct += answerTime - startTime;
    }
  }
};

const resultsDashboard = { Viewer, mergeLog, initData };

export default {
  progress: ProgressDashboard,
  leaderboard: LeaderBoard,
  results: resultsDashboard
};
