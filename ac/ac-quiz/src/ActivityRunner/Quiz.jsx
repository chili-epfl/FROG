// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import seededShuffle from 'seededshuffle';
import { type ActivityRunnerT } from 'frog-utils';

import Question from './Question';

export const condShuffle = (
  list: Object,
  type: string,
  salt: string,
  seed: string
) => seededShuffle.shuffle(list, seed + salt, true);

export default (props: ActivityRunnerT) => {
  const { activityData, groupingValue, data, dataFn } = props;

  const rawQuestions = activityData.config.questions.filter(
    q => q.question && q.answers
  ).map((x,i) => [x, i]);
  const questions = ['questions', 'both'].includes(activityData.config.shuffle)
    ? condShuffle(rawQuestions, 'questions', '', groupingValue)
    : rawQuestions;
  const onSubmit = () => {
    if (Object.keys(data).length >= Object.keys(questions).length) {
      dataFn.objInsert(true, 'completed');
    }
  };

  return [
    ...questions.map(([ question, index]) => (
      <Question {...props} question={question} index={index} key={index} />
    )),
    <button onClick={onSubmit} key="submit">
      Submit
    </button>
  ];
};
