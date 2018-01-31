// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { CountChart, ScatterChart, LineChart, type LogDBT } from 'frog-utils';

const Viewer = (props: Object) => {
  const { data, config, instances} = props;
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

  const answerCounts = questions.map((q, qIndex) =>
    ((data && Object.values(data)) || []).reduce((acc, val) => {
      console.log(acc);
      console.log(val);
      console.log(acc[val[qIndex]]);
      acc[val[qIndex]] += 1;
      return acc;
    }, q.answers.map(() => 0))
  );

  // const timingData = [[]];
  // for (let i = 0; i < data['timing'].length; i+= 1) {
  //   timingData.push([data['timing'][0],data['timing'][1]/(Object.keys(instances).length)*100]);
  // }

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
      {/* {<LineChart
          data={timingData}
        />
      } */}
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!data[log.instanceId]) {
      dataFn.objInsert({ [log.itemId]: log.value }, [log.instanceId]);
    } else {
      dataFn.objInsert(log.value, [log.instanceId, log.itemId]);
    }
  } else if (log.type === 'progress') {
    console.log(data);
    let diffProg = log.value;
    console.log('1' + diffProg);
    if (!data['progDiff_'+log.instanceId]) {
      dataFn.objInsert(0, ('progress_'+log.instanceId));
      dataFn.objInsert(diffProg, ('progDiff_'+log.instanceId));
      dataFn.objInsert(log.timestamp, ('timeCounter'));
    } else {
      diffProg = log.type - data['progress_'+log.instanceId];
      dataFn.objInsert(diffProg, ('progDiff_'+log.instanceId));
    }

    if ((new Date(log.timestamp) - new Date(data['timeCounter']))/1000 > 10) {
      let totalProgDiff = 0;
      console.log('1' + totalProgDiff);
      for (let i = 0; i < Object.keys(data).length; i+= 1) {
         if(Object.keys(data)[i].includes('progDiff')) {
           if ('progDiff_'+log.instanceId !== Object.keys(data)[i]) {
             console.log(data[Object.keys(data)[i]]);
             totalProgDiff += data[Object.keys(data)[i]];
             console.log('In:' + totalProgDiff);
             const name = Object.keys(data)[i].split("_");
             dataFn.objInsert(data['progress_'+name[1]]+data[Object.keys(data)[i]], ('progress_'+name[1]));
             dataFn.objInsert(0, (Object.keys(data)[i]));
           }
           dataFn.objInsert(data['progress_'+log.instanceId]+diffProg, ('progress_'+log.instanceId));
           dataFn.objInsert(0, (Object.keys(data)[i]));
         }
       }
       totalProgDiff += diffProg;
       console.log('Out: ' + totalProgDiff);
       console.log(data);

      //  if (!data['timing']) {
      //   // need to add start time
      //   dataFn.objInsert([[log.timestamp, totalProgDiff]], 'timing');
      // } else {
      //   const totalProg = data['timing'][data['timing'].length -1][1] + totalProgDiff;
      //   dataFn.objInsert([[log.timestamp, totalProg]], 'timing');
      // }
      // dataFn.objInsert(log.timestamp, ('timeCounter'));
    }

  }
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
