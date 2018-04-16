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

const Viewer = (props: dashboardViewerPropsT) => {
  console.log(props.data);

  return <h1>H</h1>;
};

const SymmetryStats = props => {
  // const errRate = o => o.wrong / (o.wrong + o.correct);
  // const chartData = Object.keys(d).map(speed => [
  //   parseInt(speed, 10),
  //   errRate(d[speed])
  // ]);
  // return chartData.length > 0 ? (
  //   <Chart
  //     chartType="LineChart"
  //     columns={[
  //       { type: 'number', label: 'Speed' },
  //       { type: 'number', label: 'Error Rate' }
  //     ]}
  //     rows={chartData}
  //     options={options('Condition: ' + task, 'Error rate', 'Speed', 3, 8)}
  //   />
  // ) : (
  //   <p>No data currently</p>
  // );
};

const initData = {
  error: {},
  time: {}
};

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { activity, iteration, checkAnswer } = log.payload;

    if (!data['error'][activity] || !data['error'][activity][iteration]) {
      const payload = {
        [activity]: {
          [iteration]: {
            wrong: 0,
            count: 0,
            correct: 0
          }
        }
      };
      dataFn.objInsert(...payload, ['error']);
    }
    if (checkAnswer) {
      dataFn.numIncr(1, ['error', activity, iteration, 'correct']);
      dataFn.numIncr(1, ['error', activity, iteration, 'count']);
    } else {
      dataFn.numIncr(1, ['error', activity, iteration, 'wrong']);
      dataFn.numIncr(1, ['error', activity, iteration, 'count']);
    }
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  progress: ProgressDashboard,
  stats: statsDashboard
};
