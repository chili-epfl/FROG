// @flow

import * as React from 'react';
import { Chart } from 'react-google-charts';

import {
  type LogT,
  type DashboardViewerPropsT,
  ProgressDashboard
} from 'frog-utils';

const options = (title, yLabel, xLabel, xmin, xmax) => ({
  bar: { groupWidth: '90%' },
  legend: { position: 'none' },
  width: '100%',
  height: '300px',
  title,
  vAxis: { title: yLabel },
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

const Viewer = (props: DashboardViewerPropsT) => (
  <React.Fragment>
    <SymmetryStats {...props} task="easy" />
    <SymmetryStats {...props} task="hard" />
  </React.Fragment>
);

const SymmetryStats = ({ state, task }: DashboardViewerPropsT) => {
  const d = state[task];
  const errRate = o => o.wrong / (o.wrong + o.correct);
  const chartData = Object.keys(d).map(speed => [
    parseInt(speed, 10),
    errRate(d[speed])
  ]);
  return chartData.length > 0 ? (
    <Chart
      chartType="LineChart"
      columns={[
        { type: 'number', label: 'Speed' },
        { type: 'number', label: 'Error Rate' }
      ]}
      rows={chartData}
      options={options('Condition: ' + task, 'Error rate', 'Speed', 3, 8)}
    />
  ) : (
    <p>No data currently</p>
  );
};

const initData = {
  easy: {},
  hard: {}
};

const mergeLog = (state: any, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { expectedAnswer, answer, difficulty, speed } = log.payload;
    if (!state[difficulty][speed.toString()]) {
      state[difficulty][speed.toString()] = { wrong: 0, correct: 0 };
    }
    if (expectedAnswer === answer) {
      state[difficulty][speed.toString()].correct += 1;
    } else {
      state[difficulty][speed.toString()].wrong += 1;
    }
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  progress: ProgressDashboard,
  stats: statsDashboard
};
