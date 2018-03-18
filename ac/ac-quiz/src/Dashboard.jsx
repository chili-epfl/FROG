// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { Button } from 'react-bootstrap';
import { withState } from 'recompose';

import {
  CountChart,
  ScatterChart,
  ProgressDashboard,
  LeaderBoard,
  type LogDBT,
  type ActivityDbT,
  type dashboardViewerPropsT
} from 'frog-utils';

const ScatterViewer = (props: dashboardViewerPropsT) => {
  const { data: { answers }, config } = props;
  if (!config.argueWeighting) {
    return null;
  }

  const questions = config.questions.filter(q => q.question && q.answers);
  const scatterData = Object.keys(answers).map(instance => {
    const coordinates = [0, 0];
    questions.forEach((q, qIndex) => {
      if (
        answers[instance] &&
        answers[instance][qIndex] !== undefined &&
        q.answers[answers[instance][qIndex]]
      ) {
        const answerIndex = answers[instance][qIndex];
        const noiseX = 2 * Math.random() - 1;
        const noiseY = 2 * Math.random() - 1;
        coordinates[0] += q.answers[answerIndex].x + noiseX;
        coordinates[1] += q.answers[answerIndex].y + noiseY;
      }
    });
    return coordinates;
  });
  if (scatterData.length > 0) {
    return <ScatterChart data={scatterData} />;
  } else {
    return <p>No data</p>;
  }
};

const AnswerCountViewer = (props: dashboardViewerPropsT) => {
  const { data: { answers }, config } = props;
  if (!config) {
    return null;
  }

  const questions = config.questions.filter(q => q.question && q.answers);

  const answerCounts = questions.map((q, qIndex) =>
    ((answers && Object.values(answers)) || []).reduce((acc, val) => {
      acc[val[qIndex]] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return (
    <React.Fragment>
      {questions.map((q, qIndex) => (
        <CountChart
          key={qIndex}
          title={q.question}
          vAxis="Possible answers"
          hAxis="Number of answers"
          categories={q.answers.map(x => x.choice)}
          data={answerCounts[qIndex]}
        />
      ))}
    </React.Fragment>
  );
};

const RawViewer = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const JustificationViewer = ({ data, users, activity }) => {
  const { justifications } = data;
  if (Object.keys(justifications).length === 0) {
    return <p>No justifications written yet</p>;
  } else {
    return Object.keys(justifications).map(instance => {
      const instanceName = activity.plane === 1 ? users[instance] : instance;
      return (
        <pre key={instance}>
          <p>{'From: ' + instanceName}</p>
          <p style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
            {'Text: ' + justifications[instance]}
          </p>
        </pre>
      );
    });
  }
};

const Select = ({ target, onClick }) => (
  <Button onClick={() => onClick(target)}>{target}</Button>
);

const Viewer = withState('which', 'setWhich', null)(
  (props: dashboardViewerPropsT) => {
    const { which, setWhich } = props;
    return (
      <div>
        <Select target="progress" onClick={setWhich} />
        <Select target="scatter" onClick={setWhich} />
        <Select target="count" onClick={setWhich} />
        <Select target="leaderboard" onClick={setWhich} />
        <Select target="justifications" onClick={setWhich} />
        <Select target="raw" onClick={setWhich} />
        {which === 'progress' && <ProgressDashboard.Viewer {...props} />}
        {which === 'scatter' && <ScatterViewer {...props} />}
        {which === 'count' && <AnswerCountViewer {...props} />}
        {which === 'leaderboard' && <LeaderBoard.Viewer {...props} />}
        {which === 'justifications' && <JustificationViewer {...props} />}
        {which === 'raw' && <RawViewer {...props} />}
      </div>
    );
  }
);

const mergeLog = (
  data: any,
  dataFn: Object,
  log: LogDBT,
  activity: ActivityDbT
) => {
  ProgressDashboard.mergeLog(data, dataFn, log, activity);
  LeaderBoard.mergeLog(data, dataFn, log, activity);
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!data['answers'][log.instanceId]) {
      dataFn.objInsert({ [log.itemId]: log.value }, [
        'answers',
        log.instanceId
      ]);
    } else {
      dataFn.objInsert(log.value, ['answers', log.instanceId, log.itemId]);
    }
  }
  if (log.type === 'reactivetext.focus' || log.type === 'reactivetext.blur') {
    dataFn.objInsert(log.value, ['justifications', log.instanceId]);
  }
  if (log.type === 'coordinates' && log.payload) {
    dataFn.objInsert(
      [log.payload.x, log.payload.y],
      ['coordinates', log.instanceId]
    );
  }
};

const initData = {
  answers: {},
  justifications: {},
  coordinates: {},
  ...ProgressDashboard.initData,
  ...LeaderBoard.initData
};

export default {
  Viewer,
  mergeLog,
  initData
};
