/* eslint-disable react/no-array-index-key */

import { type ActivityDbT, entries, values } from 'frog-utils';
import { reverse } from 'lodash';
import Viewer from './ViewerCount';

const reactiveToDisplay = (reactive: any, activity: ActivityDbT) => {
  const questions = activity?.data?.questions;
  if (!questions) {
    return;
  }

  const questionStats = questions.map(q =>
    (q.answers || []).map(a => ({ x: a.choice, y: 0 }))
  );

  const questionTexts = questions.map(() => []);
  values(reactive).forEach(instanceData =>
    entries(instanceData.form || {}).forEach(([qIdx, answer]) => {
      entries(answer || {}).forEach(([aIdx, aValue]) => {
        if (aValue === true) {
          questionStats[qIdx][aIdx].y += 1;
        }
        if (answer && answer.text) {
          questionTexts[qIdx].push(answer.text);
        }
      });
    })
  );

  const result = questionStats
    .map((v, k) => [questions[k].question, reverse(v), k])
    .filter(([_, v]) => v && v.length > 0);
  return { result, questionTexts, questions };
};

export default {
  Viewer,
  reactiveToDisplay,
  initData: []
};
