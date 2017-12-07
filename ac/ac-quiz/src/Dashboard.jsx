// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { CountChart, type LogDBT } from 'frog-utils';

const Viewer = ({ data, config }: Object) => {
  if (!config) {
    return null;
  }
  const questions = config.questions.filter(q => q.question && q.answers);
  const answerCounts = questions.map((q, i) =>
    ((data && Object.values(data)) || []).reduce((acc, val) => {
      acc[val['question ' + i]] = acc[val['question ' + i]] + 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return (
    <div>
      {questions.map((q, i) => (
        <CountChart
          key={i}
          title={q.question}
          vAxis="Possible answers"
          hAxis="Number of answers"
          categories={q.answers.map(x => x.choice)}
          data={answerCounts[i]}
        />
      ))}
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  dataFn.objInsert(log.payload, log.instanceId);
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
