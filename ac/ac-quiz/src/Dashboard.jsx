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
  const { data: { answers }, config, instances } = props;
  const questions = config.questions.filter(q => q.question && q.answers);
  const scatterData =
    config.argueWeighting &&
    instances.map(instance => {
      const coordinates = [0, 0];
      questions.forEach((q, qIndex) => {
        if (
          answers[instance] &&
          answers[instance][qIndex] &&
          q.answers[answers[instance][qIndex] - 1]
        ) {
          const answerIndex = answers[instance][qIndex] - 1;
          coordinates[0] += q.answers[answerIndex].x;
          coordinates[1] += q.answers[answerIndex].y;
        }
      });
      return coordinates;
    });
  if (scatterData) {
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
        {which === 'progress' && <ProgressDashboard.Viewer {...props} />}
        {which === 'scatter' && <ScatterViewer {...props} />}
        {which === 'count' && <AnswerCountViewer {...props} />}
        {which === 'leaderboard' && <LeaderBoard.Viewer {...props} />}
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
  ProgressDashboard.mergeLog(data, dataFn, log, activity);
  LeaderBoard.mergeLog(data, dataFn, log, activity);
};

const initData = {
  answers: {},
  ...ProgressDashboard.initData,
  ...LeaderBoard.initData
};

export default {
  Viewer,
  mergeLog,
  initData
};
