// @flow

import * as React from 'react';
import { Chart } from 'react-google-charts';

import {
  type LogT,
  type dashboardViewerPropsT,
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

const Viewer = (props: dashboardViewerPropsT) => (
  <React.Fragment>
    <SymmetryStats {...props} task="easy" />
    <SymmetryStats {...props} task="hard" />
  </React.Fragment>
);

const SymmetryStats = ({ data, task }: dashboardViewerPropsT) => {
  const d = data[task];
  console.log(data);
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

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { expectedAnswer, answer, difficulty, speed } = log.payload;
    if (!data[difficulty][speed.toString()]) {
      dataFn.objInsert({ wrong: 0, correct: 0 }, [
        difficulty,
        speed.toString()
      ]);
    }
    if (expectedAnswer === answer) {
      dataFn.numIncr(1, [difficulty, speed.toString(), 'correct']);
    } else {
      dataFn.numIncr(1, [difficulty, speed.toString(), 'wrong']);
    }
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  progress: ProgressDashboard,
  stats: statsDashboard
};
