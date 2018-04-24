// @flow

import React from 'react';
import seededShuffle from 'seededshuffle';
import { type ActivityRunnerPropsT } from 'frog-utils';

import Justification from './Justification';
import Question from './Question';

export const condShuffle = (
  list: Object,
  type: string,
  salt: string,
  seed: string
) => seededShuffle.shuffle(list, seed + salt, true);

export default (props: ActivityRunnerPropsT) => {
  const { activityData, groupingValue, data, dataFn, logger } = props;
  const { config } = activityData;

  const questionsWithIndex = config.questions.map((x, i) => [x, i]);
  const questions = ['questions', 'both'].includes(config.shuffle)
    ? condShuffle(questionsWithIndex, 'questions', '', groupingValue)
    : questionsWithIndex;

  const updateCoordinates = () => {
    const coordinates = { x: 0, y: 0, valid: true };

    Object.keys(data.form).forEach(qIndex => {
      const answerIndex = data.form[qIndex];
      const q = config.questions[qIndex];
      const a = q.answers[answerIndex];
      coordinates.x += a.x || 0;
      coordinates.y += a.y || 0;
    });

    dataFn.objInsert(coordinates, ['coordinates']);
    logger([{ type: 'coordinates', payload: coordinates }]);
  };

  const onSubmit = () => {
    updateCoordinates();
    if (Object.keys(data.form).length >= Object.keys(questions).length) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  return [
    ...questions.map(([question, questionIndex], index) => (
      <Question
        key={questionIndex}
        {...{ ...props, question, index, questionIndex }}
      />
    )),
    <Justification {...props} key="justification" />,
    <button onClick={onSubmit} key="submit">
      Submit
    </button>
  ];
};
