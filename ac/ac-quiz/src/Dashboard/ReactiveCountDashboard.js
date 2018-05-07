/* eslint-disable react/no-array-index-key */

import { type ActivityDbT, entries, values } from 'frog-utils';
import Viewer from './ViewerCount';

const reactiveToDisplay = (reactive: any, activity: ActivityDbT) => {
  const questions = activity?.data?.questions;
  if (!questions) {
    return;
  }

  // const questionStats = questions.map((x,i) => ({
  //   [x.question]: x.answers.map(ans => ({ x: ans.choice, y: 0 }))
  // }));
  const questionStats = questions.reduce(
    (acc, x, i) => ({
      ...acc,
      [i]: x.answers.reduce(
        (acc2, ans, i2) => ({ ...acc2, [i2]: { x: ans.choice, y: 0 } }),
        {}
      )
    }),
    {}
  );

  values(reactive).forEach(student =>
    entries(student.form || {}).forEach(
      ([k, v]) => (questionStats[k][v].y += 1)
    )
  );

  const result = entries(questionStats).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [questions[parseInt(k, 10)].question]: values(v)
    }),
    {}
  );
  return result;
};

export default {
  Viewer,
  reactiveToDisplay,
  initData: {}
};
