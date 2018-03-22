// @flow

import * as React from 'react';

import {
  ScatterChart,
  type LogDBT,
  type dashboardViewerPropsT
} from 'frog-utils';

const Viewer = (props: dashboardViewerPropsT) => {
  const { data: { answers }, config } = props;
  if (!config.argueWeighting) {
    return null;
  }

  const questions = config.questions.filter(q => q.question && q.answers);
  const scatterData = Object.keys(answers).map(instance => {
    const coordinates = [0, 0];
    questions.forEach((q, qIndex) => {
      if (
        answers[instance] &&
        answers[instance][qIndex] !== undefined &&
        q.answers[answers[instance][qIndex]]
      ) {
        const answerIndex = answers[instance][qIndex];
        const noiseX = 2 * Math.random() - 1;
        const noiseY = 2 * Math.random() - 1;
        coordinates[0] += q.answers[answerIndex].x + noiseX;
        coordinates[1] += q.answers[answerIndex].y + noiseY;
      }
    });
    return coordinates;
  });
  if (scatterData.length > 0) {
    return <ScatterChart data={scatterData} />;
  } else {
    return <p>No data</p>;
  }
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'coordinates' && log.payload) {
    dataFn.objInsert(
      [log.payload.x, log.payload.y],
      ['coordinates', log.instanceId]
    );
  }
};

const initData = {
  coordinates: {}
};

export default { Viewer, mergeLog, initData };
