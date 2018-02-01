// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import {
  CountChart,
  ScatterChart,
  LineChart,
  type LogDBT,
  type ActivityDbT
} from 'frog-utils';

const Viewer = (props: Object) => {
  const { data, config, instances, activity } = props;
  if (!config) {
    return null;
  }

  const instAnswers = instances.reduce((newObj, prop) => {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      newObj[prop] = data[prop];
    }
    return newObj;
  }, {});

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

  const answerCounts = questions.map((q, qIndex) =>
    ((instAnswers && Object.values(instAnswers)) || []).reduce((acc, val) => {
      acc[val[qIndex]] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );

  const numWindow = Math.ceil(
    (Date.now() - activity.actualStartingTime) / WINDOW
  );
  const timingData = Array(numWindow).fill().map((_, n) => [n * WINDOW / 60000, 0]);
  const factor = 100 / Object.keys(instances).length;
  Object.keys(data.timing).forEach(timeWindow => {
    timingData[timeWindow][1] = data.timing[timeWindow] * factor;
  });
  for (let n = 0; n < numWindow-1; n+= 1) {
    timingData[n + 1][1] += timingData[n][1];
  }
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
      {
        <LineChart
          title="Activity Progress"
          vAxis="Percent Complete"
          hAxis="Time Elapsed"
          hLen={activity['length']}
          data={timingData}
        />
      }
    </div>
  );
};

// This could be a config
const WINDOW = 10000;

const mergeLog = (
  data: any,
  dataFn: Object,
  log: LogDBT,
  activity: ActivityDbT
) => {
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!data[log.instanceId]) {
      dataFn.objInsert({ [log.itemId]: log.value }, [log.instanceId]);
    } else {
      dataFn.objInsert(log.value, [log.instanceId, log.itemId]);
    }
  } else if (log.type === 'progress' && typeof log.value === 'number') {
    if (activity.actualStartingTime instanceof Date) {
      const progressDiff = log.value - (data.previous[log.instanceId] || 0);
      const start = activity.actualStartingTime
      const timeWindow = Math.floor((log.timestamp - start) / WINDOW);
      if (data.timing[timeWindow]) {
        dataFn.numIncr(progressDiff, ['timing', timeWindow]);
      } else {
        dataFn.objInsert(progressDiff, ['timing', timeWindow]);
      }
      dataFn.objInsert(log.value, ['previous', log.instanceId]);
    }
  }
};

const initData = {
  previous: {},
  timing: {}
};

export default {
  Viewer,
  mergeLog,
  initData
};
