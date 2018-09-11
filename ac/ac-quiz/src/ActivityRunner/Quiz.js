// @flow

import React from 'react';
import seededShuffle from 'seededshuffle';
import { withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';

import { type ActivityRunnerPropsT } from 'frog-utils';

import Question from './Question';
import BottomNav from './BottomNav';

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

  // test if the question has been answered
  const isAnswered = qIndex => true;

  const computeProgress = () => 0;

  const onSubmit = () => {
    const { allowSkip } = config;
    if (allowSkip || Object.keys(data.form).length >= questions.length) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
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
        hasAnswered={data.form[index] !== undefined}
      />
    </React.Fragment>
  );
};

export default withState('index', 'setIndex', 0)(Quiz);
