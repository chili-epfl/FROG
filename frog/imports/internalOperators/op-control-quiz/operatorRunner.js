// @flow
import { type controlOperatorRunnerT } from '/imports/frog-utils';

const operator = (configData, object) => {
  const quizData = object.activityData.payload;
  const { mode, questionIndex, answer } = configData;

  const payload = Object.keys(quizData).reduce((acc, studentId) => {
    if (quizData[studentId]?.data?.answers[questionIndex] === answer) {
      acc[studentId] = true;
    }
    return acc;
  }, {});

  const all = { structure: 'individual', mode, payload };
  return { all };
};

export default (operator: controlOperatorRunnerT);
