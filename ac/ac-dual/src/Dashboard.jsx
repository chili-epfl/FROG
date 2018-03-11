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
        <Select target="raw" onClick={setWhich} />
        <Select target="stats" onClick={setWhich} />
        {which === 'progress' && <ProgressDashboard.Viewer {...props} />}
        {which === 'raw' && <RawViewer {...props} />}
        {which === 'stats' && <StatsViewer {...props} />}
      </div>
    );
  }
);

const RawViewer = ({ data }) => (
  <pre>{JSON.stringify({ e: data.easy, h: data.hard }, null, 2)}</pre>
);

const options = (title, yLabel, xLabel, xmin, xmax) => ({
  bar: { groupWidth: '90%' },
  legend: { position: 'none' },
  width: '100%',
  height: '300px',
  title,
  vAxis: { yLabel },
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

const StatsViewer = (props: dashboardViewerPropsT) => (
  <React.Fragment>
    <SymmetryStats {...props} task="easy" />
    <SymmetryStats {...props} task="hard" />
  </React.Fragment>
);

const SymmetryStats = ({ data, task }: dashboardViewerPropsT) => {
  const d = data[task];
  const errRate = o => o.wrong / (o.wrong + o.correct);
  const chartData = [
    ...Object.keys(d).map(speed => [parseInt(speed, 10), errRate(d[speed])])
  ];
  return (
    <Chart
      chartType="LineChart"
      columns={[
        { type: 'number', label: 'Speed' },
        { type: 'number', label: 'ErrorRate' }
      ]}
      rows={chartData}
      options={options('Easy', 'Percentage of error', 'Speed', 3, 8)}
    />
  );
};

const initData = {
  easy: {},
  hard: {},
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

export default { Viewer, mergeLog, initData };
