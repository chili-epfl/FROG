// @flow

import React from 'react';
import seededShuffle from 'seededshuffle';
import { withState, compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { type ActivityRunnerPropsT } from 'frog-utils';

import Question from './Question';

const styles = () => ({
  buttonRight: {
    float: 'right'
  },
  buttonContainer: {
    marginTop: '20px'
  }
});

export const condShuffle = (
  list: Object,
  type: string,
  salt: string,
  seed: string
) => seededShuffle.shuffle(list, seed + salt, true);

const BottomQuizNav = withStyles(styles)(
  ({
    index,
    setIndex,
    startDelay,
    onSubmit,
    hasNext,
    hasAnswered,
    allowSkip,
    showOne,
    classes
  }) => {
    const showPrevious = showOne && index > 0;
    const showNext = showOne && hasNext && (hasAnswered || allowSkip);
    const showSubmit = !showOne || (!hasNext && (hasAnswered || allowSkip));
    return (
      <div className={classes.buttonContainer}>
        {showPrevious && (
          <Button
            variant="contained"
            onClick={() => startDelay() || setIndex(index - 1)}
          >
            Previous
          </Button>
        )}
        {showNext && (
          <Button
            variant="contained"
            onClick={() => startDelay() || setIndex(index + 1)}
            className={classes.buttonRight}
          >
            Next
          </Button>
        )}
        {showSubmit && (
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.buttonRight}
          >
            Submit
          </Button>
        )}
      </div>
    );
  }
);

const Quiz = ({
  index,
  setIndex,
  delay,
  setDelay,
  ...props
}: ActivityRunnerPropsT & {
  index: number,
  setIndex: Function,
  delay: boolean,
  setDelay: Function
}) => {
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

  const onSubmit = allowSkip => {
    updateCoordinates();
    if (
      allowSkip ||
      Object.keys(data.form).length >= Object.keys(questions).length
    ) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  const [q, qIdx] = questions[index];

  if (delay) {
    return <CircularProgress />;
  }

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
      <BottomQuizNav
        allowSkip={config.allowSkip}
        onSubmit={() => onSubmit(config.allowSkip)}
        index={index}
        setIndex={setIndex}
        showOne={config.showOne}
        hasNext={index < questions.length - 1}
        hasAnswered={data.form[index] !== undefined}
        startDelay={() => {
          setDelay(true);
          setTimeout(() => setDelay(false), 0);
        }}
      />
    </React.Fragment>
  );
};

export default compose(
  withState('index', 'setIndex', 0),
  withState('delay', 'setDelay', false)
)(Quiz);
