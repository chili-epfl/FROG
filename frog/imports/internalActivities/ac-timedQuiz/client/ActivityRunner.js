// @flow

import React, { useState } from 'react';
import {
  type ActivityRunnerPropsT,
  TimedComponent,
  HTML
} from '/imports/frog-utils';

import { LinearProgress, Button } from '@material-ui/core';

import { shuffle } from 'lodash';

let noAnswerTimeout;
let delayTimeout;

const styles = {
  text: { width: '420px', fontSize: 'large', textAlign: 'center' },
  guidelines: { width: '420px' },
  container: {
    width: '100%',
    flex: '1',
    marginTop: '16px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  commands: {
    flex: '0 0 auto',
    width: '300px',
    margin: '12px',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  button: { flex: '0 0 128px', margin: '4px' }
};

const questionsWithIndex = props => {
  const indexed = props.activityData.config.questions
    .filter(q => q.question && q.answers)
    .map((x, i) => [x, i]);
  return indexed;
};

const shuffledQuestions = props => {
  const questions = ['questions', 'both'].includes(
    props.activityData.config.shuffle
  )
    ? shuffle(questionsWithIndex(props))
    : questionsWithIndex(props);
  return questions;
};

const generateExample = (q, progress) => {
  const curQuestion = q[progress % q.length];
  const startTime = Date.now();
  return {
    curQuestion,
    startTime
  };
};

const Guidelines = ({ start, guidelines, name }) => (
  <>
    <div style={styles.text}>Welcome {name}!</div>
    <div style={styles.guidelines}>
      <HTML html={guidelines} />
    </div>
    <div style={{ ...styles.commands, width: '120px' }}>
      <Button variant="contained" color="primary" onClick={start}>
        Start
      </Button>
    </div>
  </>
);

const CountDownTimer = TimedComponent(({ timeNow, length, start }) => {
  const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
  return <div style={styles.text}>{timeLeft + ' s'}</div>;
}, 100);

const Delay = ({ next, delay }) => {
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return (
    <>
      <div style={styles.text}>Waiting for next question</div>
      <CountDownTimer start={Date.now()} length={delay} />
    </>
  );
};

const Question = props => {
  const { setQuestion, question, logger, data, dataFn, activityData } = props;
  const { curQuestion, startTime } = question;

  const answers = ['answers', 'both'].includes(activityData.config.shuffle)
    ? shuffle(curQuestion[0].answers)
    : curQuestion[0].answers;

  const onClick = answer => () => {
    clearTimeout(noAnswerTimeout);
    // Logs the question and answer provided
    const answerTime = Date.now();
    // Increases the progress and logs the new progress
    dataFn.numIncr(1, 'progress');
    // Increases the score and logs the new score
    const isCorrectAnswer =
      answer === undefined ||
      answer.isCorrect === undefined ||
      !answer.isCorrect
        ? 0
        : 1;
    const timeIncr = Date.now() - startTime;
    const value = [data.score + isCorrectAnswer, -(data.time + timeIncr)];
    logger([
      { type: 'answer', payload: { ...question, answer, answerTime } },
      {
        type: 'progress',
        value: (data.progress + 1) / activityData.config.questions.length
      },
      { type: 'score', value }
    ]);
    dataFn.numIncr(isCorrectAnswer, 'score');
    dataFn.numIncr(timeIncr, 'time');
    // Goes on to next question
    if (data.progress + 1 < activityData.config.questions.length) {
      setQuestion('waiting');
    }
  };

  clearTimeout(noAnswerTimeout);
  noAnswerTimeout = setTimeout(onClick(undefined), activityData.config.maxTime);
  return (
    <>
      <div style={styles.text}>
        <HTML html={curQuestion[0].question} />
      </div>
      <div style={styles.commands}>
        {answers.map(option => {
          const key = curQuestion[1] + option.choice;
          return (
            <Button
              key={key}
              variant="contained"
              color="secondary"
              onClick={onClick(option)}
              style={styles.button}
            >
              {option.choice}
            </Button>
          );
        })}
      </div>
      <CountDownTimer start={Date.now()} length={activityData.config.maxTime} />
    </>
  );
};

const Main = props => {
  const [question, setQuestion] = useState(null);
  const { activityData, data, logger } = props;
  const { questions, delay, guidelines } = activityData.config;
  const { name } = props.userInfo;
  let shuffledQ = questionsWithIndex(props);
  if (question === null) {
    shuffledQ = shuffledQuestions(props);
    const start = () => {
      setQuestion('waiting');
      logger([
        {
          type: 'progress',
          value: data.progress / activityData.config.questions.length
        }
      ]);
    };
    return <Guidelines start={start} guidelines={guidelines} name={name} />;
  } else if (question === 'waiting') {
    const next = () => {
      setQuestion(generateExample(shuffledQ, data.progress));
    };
    return <Delay next={next} delay={delay} props={props} />;
  } else if (data.progress < questions.length) {
    return (
      <Question {...props} question={question} setQuestion={setQuestion} />
    );
  } else {
    return <div style={styles.text}>Activity completed! Thank you</div>;
  }
};

// the actual component that the student sees
const Runner = (props: ActivityRunnerPropsT) => {
  const { data, activityData } = props;
  const { questions } = activityData.config;
  const p = Math.round((100 * data.progress) / questions.length);

  return (
    <div style={styles.main}>
      <LinearProgress
        variant="determinate"
        value={p}
        style={{ height: '16px' }}
      />
      <div style={styles.container}>
        <Main {...props} />
      </div>
    </div>
  );
};

export default class ActivityRunner extends React.Component<ActivityRunnerPropsT> {
  componentWillUnmount() {
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
