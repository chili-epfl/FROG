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
        <Select target="stroop" onClick={setWhich} />
        {which === 'progress' && <ProgressDashboard.Viewer {...props} />}
        {which === 'leaderboard' && <LeaderBoard.Viewer {...props} />}
        {which === 'stroop' && <StroopViewer {...props} />}
      </div>
    );
  }
);

// <Select target="raw" onClick={setWhich} />
// {which === 'raw' && <RawDataViewer {...props} />}

const StroopViewer = ({ data }: dashboardViewerPropsT) => {
  const { consistent, inconsistent } = data;
  const options = (title, xLabel, xmin, xmax) => ({
    bar: { groupWidth: '90%' },
    legend: { position: 'none' },
    width: '100%',
    height: '300px',
    vAxis: { title: 'Type of question' },
    hAxis: {
      viewWindowMode: 'explicit',
      viewWindow: {
        max: xmax,
        min: xmin
      },
      title: xLabel,
      gridlines: { count: 5 }
    }
  });
  const errRate = o => o.wrong.count / (o.wrong.count + o.correct.count);
  const errorData = [
    ['Category', 'Count'],
    ['Consistent', errRate(consistent)],
    ['Inconsistent', errRate(inconsistent)]
  ];
  const avgTime = o =>
    (o.correct.time + o.wrong.time) / (o.correct.count + o.wrong.count);
  const timeData = [
    ['Category', 'Count'],
    ['Consistent', avgTime(consistent)],
    ['Inconsistent', avgTime(inconsistent)]
  ];
  return (
    <React.Fragment>
      <Chart
        chartType="BarChart"
        data={errorData}
        options={options('Error rate', 'Percentage of error', 0, 1)}
      />
      <Chart
        chartType="BarChart"
        data={timeData}
        options={options('Average time', 'Average time (ms)', 0, 4000)}
      />
    </React.Fragment>
  );
};

// const RawDataViewer = ({ data }: dashboardViewerPropsT) => (
//   <pre>{JSON.stringify(data, null, 2)}</pre>
// );

const initData = {
  consistent: { correct: { count: 0, time: 0 }, wrong: { count: 0, time: 0 } },
  inconsistent: {
    correct: { count: 0, time: 0 },
    wrong: { count: 0, time: 0 }
  },
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
    const {
      isConsistent,
      isCorrect,
      answer,
      startTime,
      answerTime
    } = log.payload;
    const qType = isConsistent ? 'consistent' : 'inconsistent';
    if (isCorrect === answer) {
      dataFn.numIncr(1, [qType, 'correct', 'count']);
      dataFn.numIncr(answerTime - startTime, [qType, 'correct', 'time']);
    } else {
      dataFn.numIncr(1, [qType, 'wrong', 'count']);
      dataFn.numIncr(answerTime - startTime, [qType, 'wrong', 'time']);
    }
  }
};

const activityMerge = {
  actualStartingTime: '2018-02-20T08:16:05.308Z',
  actualClosingTime: '2018-02-20T08:19:45.140Z'
};

const exampleLogs = [
  {
    title: 'CS211 week 1',
    path: 'src/logExamples/progress-cs211-w1-1000.json',
    activityMerge,
    instances: 118
  },
  {
    title: 'CS211 week 1 (n=400)',
    path: 'src/logExamples/progress-cs211-w1-short.json',
    activityMerge,
    instances: 118
  }
];

export default { Viewer, mergeLog, initData, exampleLogs };
