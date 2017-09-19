// @flow

import React from 'react';
import { CountChart } from 'frog-utils';

const Viewer = ({ data, config }: Object) => {
  const questions = config.questions.filter(q => q.question && q.answers);
  const answerCounts = questions.map((q, i) =>
    ((data && Object.values(data)) || []).reduce((acc, val) => {
      acc[val['question ' + i]] = acc[val['question ' + i]] + 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return (
    <div>
      {questions.map((q, i) =>
        <CountChart
          key={q.question}
          title={q.question}
          vAxis="Possible answers"
          hAxis="Number of answers"
          categories={q.answers}
          data={answerCounts[i]}
        />
      )}
    </div>
  );
};

const mergeLog = (
  data: any,
  dataFn: Object,
  { instanceId, payload }: { instanceId: string, payload: any }
) => {
  dataFn.objInsert(payload, instanceId);
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
