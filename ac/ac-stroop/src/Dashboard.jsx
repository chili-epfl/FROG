// @flow

import * as React from 'react';
import { type LogT, dashboardViewerPropsT } from 'frog-utils';

const Viewer = ({ data }: dashboardViewerPropsT) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

const initData = {
  consistent: { correct: { count: 0, time: 0 }, wrong: { count: 0, time: 0 } },
  inconsistent: { correct: { count: 0, time: 0 }, wrong: { count: 0, time: 0 } }
};

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const {
      isConsistent,
      isCorrect,
      answer,
      startTime,
      answerTime
    } = log.payload;
    const qType = isConsistent ? 'consistent' : 'inconsistent';
    if (isCorrect === answer) {
      dataFn.numIncr(1, [qType, 'correct', 'count']);
      dataFn.numIncr(answerTime - startTime, [qType, 'correct', 'time']);
    } else {
      dataFn.numIncr(1, [qType, 'wrong', 'count']);
      dataFn.numIncr(answerTime - startTime, [qType, 'wrong', 'time']);
    }
  }
};

export default { Viewer, mergeLog, initData };
