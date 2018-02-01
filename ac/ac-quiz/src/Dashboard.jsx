// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { CountChart, ScatterChart, LineChart, type LogDBT, type ActivityDbT } from 'frog-utils';

const Viewer = (props: Object) => {
  const { data, config, instances, activity} = props;
  if (!config) {
    return null;
  }

  const instAnswers = instances.reduce((newObj, prop) => {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      (newObj[prop] = data[prop]);
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

  const timingData = [[0,0,0,0]];
  for (let i = 0; i < (data['timing'] || []).length; i+= 1) {
    timingData.push([data['timing'][i][0],(data['timing'][i][1]/(Object.keys(instances).length)*100),data['timing'][i][2],data['timing'][i][3]]);
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
      {<LineChart
        title="Activity Progress"
        vAxis="Percent Complete"
        hAxis="Time Elapsed"
        hLen={activity['length']}
        rows={timingData}
      />
    }
  </div>
);
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT, activity: ActivityDbT) => {
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!data[log.instanceId]) {
      dataFn.objInsert({ [log.itemId]: log.value }, [log.instanceId]);
    } else {
      dataFn.objInsert(log.value, [log.instanceId, log.itemId]);
    }
  } else if (log.type === 'progress') {
    if (!data['timeCounter']) {
      dataFn.objInsert(activity['actualStartingTime'], ('timeCounter'));
    }

    let diffProg = log.value;

    if (data['progress_'+log.instanceId] !== undefined) {
      diffProg = log.value - data['progress_'+log.instanceId];
    }
    dataFn.objInsert(log.value, ('progress_'+log.instanceId));


    if (!data['timing']) {
      dataFn.objInsert([[(new Date(log.timestamp) - new Date(activity['actualStartingTime']))/1000/60, diffProg,0,0]], 'timing');
    } else {
      const totalProg = data['timing'][data['timing'].length -1][1] + diffProg;
      if ((new Date(log.timestamp) - new Date(data['timeCounter']))/1000 > 5) {
      data['timing'].push([(new Date(log.timestamp) - new Date(activity['actualStartingTime']))/1000/60, totalProg,0,0]);
      dataFn.objInsert(data['timing'], 'timing');
      dataFn.objInsert(log.timestamp, ('timeCounter'));
    } else {
      data['timing'][data['timing'].length - 1] = [(new Date(log.timestamp) - new Date(activity['actualStartingTime']))/1000/60, totalProg,0,0];
      dataFn.objInsert(data['timing'], 'timing');
    }
  }

  }

};


const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
