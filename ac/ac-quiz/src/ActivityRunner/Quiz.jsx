// @flow

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

  const questionsWithIndex = activityData.config.questions.filter(
    q => q.question && q.answers
  ).map((x,i) => [x, i]);
  const questions = ['questions', 'both'].includes(activityData.config.shuffle)
    ? condShuffle(questionsWithIndex, 'questions', '', groupingValue)
    : questionsWithIndex;
  const onSubmit = () => {
    if (Object.keys(data).length >= Object.keys(questions).length) {
      dataFn.objInsert(true, 'completed');
    }
  };

  return [
    ...questions.map(([question, questionIndex], index) => (
      <Question {...{ ...props, question, index, questionIndex, key: questionIndex }} />
    )),
    <button onClick={onSubmit} key="submit">
      Submit
    </button>
  ];
};
