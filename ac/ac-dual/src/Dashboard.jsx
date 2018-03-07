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

const RawViewer = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

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
    <SymmetryStats {...props} />
    <GameStats {...props} />
  </React.Fragment>
);

const SymmetryStats = ({ data }: dashboardViewerPropsT) => {
  const { easy, hard } = data.symmetry;
  const errRate = o => o.wrong / (o.wrong + o.correct);
  const symmetryData = [
    ['Category', 'Value'],
    ['Easy', errRate(easy)],
    ['Hard', errRate(hard)]
  ];
  return (
    <Chart
      chartType="BarChart"
      data={symmetryData}
      options={options('Symmetry', '', 'Percentage of error', 0, 0.5)}
    />
  );
};

const GameStats = ({ data, config,  }: dashboardViewerPropsT) => {
  const { single, easy, hard, participation } = data.game;
  const t = config.timeOfEachActivity / 1000;
  const gameData = [
    ['Category', 'Value'],
    ['single', single / t / (participation.single || 1)],
    ['easy', easy / (t / 2) / (participation.dual || 1)],
    ['hard', hard / (t / 2) / (participation.dual || 1)]
  ];
  return (
    <Chart
      chartType="BarChart"
      data={gameData}
      options={options('Game', '...', 'Number of error per second', 0, 0.2)}
    />
  );
};

const initData = {
  symmetry: { easy: { correct: 0, wrong: 0 }, hard: { correct: 0, wrong: 0 } },
  game: { easy: 0, hard: 0, single: 0, participation: { dual: 0, single: 0 } },
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
    const { expectedAnswer, answer, answerPath } = log.payload;
    if (expectedAnswer === answer) {
      dataFn.numIncr(1, [...answerPath, 'correct']);
    } else {
      dataFn.numIncr(1, [...answerPath, 'wrong']);
    }
  }
  if (log.type === 'error' && log.payload) {
    const { errorPath } = log.payload;
    dataFn.numIncr(1, errorPath);
  }
  if (log.type === 'starting_game' && log.payload) {
    const { step } = log.payload
    dataFn.numIncr(1, [ 'game', 'participation', step === 2 ? 'dual' : 'single']);
  }
};

export default { Viewer, mergeLog, initData };
