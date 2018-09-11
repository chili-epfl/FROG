// @flow

import React from 'react';
import seededShuffle from 'seededshuffle';
import { withState } from 'recompose';

import { type ActivityRunnerPropsT } from 'frog-utils';

import Question from './Question';
import BottomNav from './BottomNav';
import { isAnswered, computeCoordinates } from '../utils';

export const condShuffle = (
  list: Object,
  type: string,
  salt: string,
  seed: string
) => seededShuffle.shuffle(list, seed + salt, true);

const Quiz = ({
  index,
  setIndex,
  ...props
}: ActivityRunnerPropsT & {
  index: number,
  setIndex: Function
}) => {
  const { activityData, groupingValue, data, dataFn, logger } = props;
  const { config } = activityData;

  const questionsWithIndex = config.questions.map((x, i) => [x, i]);
  const questions = ['questions', 'both'].includes(config.shuffle)
    ? condShuffle(questionsWithIndex, 'questions', '', groupingValue)
    : questionsWithIndex;

  questions.forEach(([_, questionIndex]) => {
    if (!data.form[questionIndex]) {
      dataFn.objInsert({ text: '' }, ['form', questionIndex]);
    }
  });

  const onSubmit = () => {
    const { allowSkip } = config;
    if (allowSkip || Object.keys(data.form).length >= questions.length) {
      dataFn.objInsert(true, ['completed']);
      const coordinates = computeCoordinates(config.questions, data.form);

      logger([
        { type: 'progress', value: 1 },
        { type: 'coordinates', payload: coordinates }
      ]);
    }
  };

  const [q, qIdx] = questions[index];

  return (
    <React.Fragment>
      {config.showOne && (
        <Question {...{ ...props, question: q, index, questionIndex: qIdx }} />
      )}
      {!config.showOne &&
        questions.map(([question, questionIndex], i) => (
          <Question
            key={questionIndex}
            {...{ ...props, question, index: i, questionIndex }}
          />
        ))}
      <BottomNav
        allowSkip={config.allowSkip}
        onSubmit={onSubmit}
        index={index}
        setIndex={setIndex}
        showOne={config.showOne}
        hasNext={index < questions.length - 1}
        hasAnswered={isAnswered(data.form[qIdx], config.questions[qIdx])}
      />
    </React.Fragment>
  );
};

export default withState('index', 'setIndex', 0)(Quiz);
