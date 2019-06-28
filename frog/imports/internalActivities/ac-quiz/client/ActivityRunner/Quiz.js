// @flow

import * as React from 'react';
import seededShuffle from 'seededshuffle';
import { withState } from 'recompose';

import { type ActivityRunnerPropsT } from 'frog-utils';

import Question from './Question';
import BottomNav from './BottomNav';
import { isAnswered, computeCoordinates } from '../../utils';

export const condShuffle = (
  list: any[],
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

  const canSubmit =
    config.allowSkip ||
    config.questions.reduce(
      (acc, q, qIdx) => acc && isAnswered(data.form[qIdx], q),
      true
    );

  const onSubmit = () => {
    if (canSubmit) {
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
    <>
      {config.showOne && (
        <Question
          {...{ ...props, key: qIdx, question: q, index, questionIndex: qIdx }}
        />
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
        canSubmit={canSubmit}
      />
    </>
  );
};

const DefaultExport: React.ComponentType<*> = withState('index', 'setIndex', 0)(
  Quiz
);

export default DefaultExport;
