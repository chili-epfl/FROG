// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';

import { CountChart, type LogDBT, type ActivityDBT } from 'frog-utils';

const Viewer = ({ state: { answerCounts, questions } }: any) => (
  <React.Fragment>
    {(questions || []).map((q, qIndex) => (
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

const prepareDisplay = (state: any, activity: ActivityDBT) => {
  const { answers } = state;
  const { data: config } = activity;
  if (!config || !config.questions) {
    return null;
  }

  const questions = config.questions.filter(q => q.question && q.answers);

  const answerCounts = questions.map((q, qIndex) =>
    ((answers && Object.values(answers)) || []).reduce((acc, val) => {
      acc[val[qIndex]] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return { answerCounts, questions };
};

const mergeLog = (state: any, log: LogDBT) => {
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!state['answers'][log.instanceId]) {
      state.answers[log.instanceId] = { [log.itemId]: log.value };
    } else {
      state.answers[log.instanceId][log.itemId] = log.value;
    }
  }
};

const initData = {
  answers: {}
};

export default {
  Viewer,
  prepareDisplay,
  mergeLog,
  initData
};
