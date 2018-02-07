// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import {
  CountChart,
  ScatterChart,
  LineChart,
  type LogDBT,
  type ActivityDbT,
  TimedComponent
} from 'frog-utils';

const TIMEWINDOW = 5;

const ProgressViewer = TimedComponent((props: Object) => {
  const { data, instances, activity, timeNow } = props;

  const numWindow = Math.ceil(
    (timeNow - activity.actualStartingTime) / 1000 / TIMEWINDOW
  );
  const timingData = [[0, 0, 0, 0]];
  const factor = 100 / Object.keys(instances).length;
  for (let i = 0, j = -1; i <= numWindow; i += 1) {
    if (i * TIMEWINDOW === (data['timing'][j + 1] || [0])[0]) {
      j += 1;
    }
    timingData.push([
      i * TIMEWINDOW / 60,
      data['timing'][j][1] * factor,
      data['timing'][j][2],
      data['timing'][j][3]
    ]);
  }
  return (
    <LineChart
      title="Activity Progress"
      vAxis="Percent Complete"
      hAxis="Time Elapsed"
      hLen={props.activity['length']}
      rows={timingData}
    />
  );
}, TIMEWINDOW * 1000);

const Viewer = (props: Object) => {
  const { data, config, instances } = props;
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
      instances.map(instance => {
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

  return (
    <div>
      {config.argueWeighting && <ScatterChart data={scatterData} />}
      <ProgressViewer {...props} />
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
  } else if (
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    const progDiff =
      (data['timing'][data['timing'].length - 1][1] || 0) +
      log.value -
      (data.progress[log.instanceId] || 0);
    dataFn.objInsert(log.value, ['progress', log.instanceId]);

    // $FlowFixMe
    const timeDiff = (log.timestamp - activity.actualStartingTime) / 1000;

    const max =
      log.value > data['timing'][data['timing'].length - 1][2]
        ? log.value
        : data['timing'][data['timing'].length - 1][2];

    if (
      Math.ceil(timeDiff / TIMEWINDOW) !==
      data['timing'][data['timing'].length - 1][0] / TIMEWINDOW
    ) {
      dataFn.listAppend(
        [Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW, progDiff, max, 0],
        'timing'
      );
    } else {
      data['timing'][data['timing'].length - 1] = [
        Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW,
        progDiff,
        max,
        0
      ];
      dataFn.objInsert(data['timing'], 'timing');
    }
  }
};

const initData = {
  progress: {},
  timing: [[0, 0, 0, 0]]
};

export default {
  Viewer,
  mergeLog,
  initData
};
