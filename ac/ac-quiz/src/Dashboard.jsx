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
        questions.forEach((q, i) => {
          if (
            data[instance] &&
            data[instance]['q' + (i + 1)] &&
            q.answers[data[instance]['q' + (i + 1)] - 1]
          ) {
            coordinates[0] += q.answers[data[instance]['q' + (i + 1)] - 1].x;
            coordinates[1] += q.answers[data[instance]['q' + (i + 1)] - 1].y;
          }
        });
        return coordinates;
      })) ||
    [];

  const answerCounts = questions.map((q, i) =>
    ((data && Object.values(data)) || []).reduce((acc, val) => {
      acc[val['q' + (i + 1)] - 1] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );
  return (
    <div>
      {config.argueWeighting && <ScatterChart data={scatterData} />}
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
