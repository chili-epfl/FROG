// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';

import {
  CountChart,
  type LogDBT,
  type dashboardViewerPropsT
} from 'frog-utils';

const Viewer = (props: dashboardViewerPropsT) => {
  const {
    data: { answers },
    config
  } = props;
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

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
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
};

const initData = {
  answers: {}
};

export default {
  Viewer,
  mergeLog,
  initData
};
