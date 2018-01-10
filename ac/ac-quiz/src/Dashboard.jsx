// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { CountChart, ScatterChart, type LogDBT } from 'frog-utils';

const Viewer = ({ data, config, instances }: Object) => {
  if (!config) {
    return null;
  }
  const questions = config.questions.filter(q => q.question && q.answers);
  const scatterData =
    (config.argueWeighting &&
      (instances || ['1', '2', '3', '4']).map(instance => {
        const coordinates = [0, 0];
        questions.forEach((q, qIndex) => {
          if (
            data[instance] &&
            data[instance][qIndex] &&
            q.answers[data[instance][qIndex] - 1]
          ) {
            const answerIndex = data[instance][qIndex] - 1;
            coordinates[0] += q.answers[answerIndex].x;
            coordinates[1] += q.answers[answerIndex].y;
          }
        });
        return coordinates;
      })) ||
    [];

  console.log(data)
  const answerCounts = questions.map((q, qIndex) =>
    ((data && Object.values(data)) || []).reduce((acc, val) => {
      acc[val[qIndex]] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return (
    <div>
      {config.argueWeighting && <ScatterChart data={scatterData} />}
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
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  console.log(log)
  if (!data[log.instanceId]) {
    dataFn.objInsert({}, [log.instanceId]);
  }
  dataFn.objInsert(log.payload, [log.instanceId, log.itemId]);
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
