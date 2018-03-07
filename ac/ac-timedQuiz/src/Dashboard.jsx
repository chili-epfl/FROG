// @flow

import * as React from 'react';
import { withState } from 'recompose';
import { Button } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

import {
  type LogT,
  type dashboardViewerPropsT,
  type ActivityDbT,
  ProgressDashboard,
  LeaderBoard
} from 'frog-utils';

const Select = ({ target, onClick }) => (
  <Button onClick={() => onClick(target)}>{target}</Button>
);

const Viewer = withState('which', 'setWhich', 'progress')(
  (props: dashboardViewerPropsT) => {
    const { which, setWhich } = props;
    return (
      <div>
        <Select target="progress" onClick={setWhich} />
        <Select target="leaderboard" onClick={setWhich} />
        <Select target="results" onClick={setWhich} />
        {which === 'progress' && <ProgressDashboard.Viewer {...props} />}
        {which === 'leaderboard' && <LeaderBoard.Viewer {...props} />}
        {which === 'results' && <ResultsViewer {...props} />}
      </div>
    );
  }
);

const ResultsViewer = ({ data }: dashboardViewerPropsT) => {
  const { results } = data;
  const options = (title, xLabel, yLabel, ymin, ymax) => ({
    legend: { position: 'none' },
    width: '100%',
    height: '300px',
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
      : Object.keys(results).map(x => [x, errRate(results[x])]);

  const avgTime = o =>
    (o.correct.time + o.wrong.time) / (o.correct.count + o.wrong.count);
  const timeData =
    Object.keys(results).length === 0
      ? [new Array(2)]
      : Object.keys(results).map(x => [x, avgTime(results[x])]);

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
  results: {},
  ...ProgressDashboard.initData,
  ...LeaderBoard.initData
};

const mergeLog = (
  data: any,
  dataFn: Object,
  log: LogT,
  activity: ActivityDbT
) => {
  ProgressDashboard.mergeLog(data, dataFn, log, activity);
  LeaderBoard.mergeLog(data, dataFn, log, activity);
  if (log.type === 'answer' && log.payload) {
    const { answer, startTime, answerTime, curQuestion } = log.payload;
    const index = curQuestion[1];
    if (!data['results'][index]) {
      if (
        answer === undefined ||
        answer.isCorrect === undefined ||
        answer.isCorrect === false
      ) {
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
    } else if (answer.isCorrect === undefined || answer.isCorrect === false) {
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

export default { Viewer, mergeLog, initData };
