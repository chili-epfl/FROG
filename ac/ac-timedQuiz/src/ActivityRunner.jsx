// @flow

import * as React from 'react';
import { type ActivityRunnerT, TimedComponent } from 'frog-utils';
import { ProgressBar, Button } from 'react-bootstrap';
import { withState } from 'recompose';
import { shuffle } from 'lodash';

const styles = {
  button: {
    width: '150 px',
    margin: '10 px',
    position: 'relative',
    whiteSpace: 'normal',
    float: 'left'
  },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  guidelines: { width: '100%' },
  container: {
    width: '500px',
    height: '400px',
    margin: 'auto',
    marginTop: '80px'
  },
  main: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  commands: {
    width: '250px',
    height: '50px',
    margin: 'auto',
    position: 'relative',
    marginTop: '50px'
  }
};

// const questionsWithIndex = activityData.config.questions
//   .filter(q => q.question && q.answers)
//   .map((x, i) => [x, i]);
//
// const shuffledQuestions = ['questions', 'both'].includes(activityData.config.shuffle)
//     ? shuffle(questionsWithIndex)
//     : questionsWithIndex;

const generateExample = (shuffledQuestions, progress) => {
  const curQuestion = shuffledQuestions[progress % shuffledQuestions.length];

  const startTime = Date.now();
  return {
    curQuestion,
    startTime
  };
};

let noAnswerTimeout;
let delayTimeout;

const Guidelines = ({ start, guidelines, name }) => (
  <React.Fragment>
    <div style={styles.text}>Welcome {name}!</div>
    <div style={styles.guidelines}>{guidelines}</div>
    <div style={{ ...styles.commands, width: '120px' }}>
      <Button style={{ ...styles.button, width: '100%' }} onClick={start}>
        {'Start'}
      </Button>
    </div>
  </React.Fragment>
);

const CountDownTimer = TimedComponent(({ timeNow, length, start }) => {
  const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
  return <div style={styles.text}>{timeLeft + ' s'}</div>;
}, 100);

const Delay = ({ next, delay }) => {
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return (
    <React.Fragment>
      <div style={styles.text}>Waiting for next question</div>
      <CountDownTimer start={Date.now()} length={delay} />
    </React.Fragment>
  );
};

const Question = props => {
  const { setQuestion, question, logger, data, dataFn, activityData } = props;
  const { curQuestion, startTime } = question;

  const answers = ['answers', 'both'].includes(activityData.config.shuffle)
    ? shuffle(curQuestion.answers)
    : curQuestion.answers;

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
        : answer.isCorrect;
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
    setQuestion('waiting');
  };

  clearTimeout(noAnswerTimeout);
  noAnswerTimeout = setTimeout(onClick(undefined), activityData.config.maxTime);

  return (
    <React.Fragment>
      <div style={styles.text}>{curQuestion.question}</div>
      <div style={styles.commands}>
        {answers.map(option => {
          const buttonA = (
            <Button
              style={{ ...styles.button }}
              onClick={onClick(option.choice)}
            >
              {option.choice}
            </Button>
          );
          return buttonA;
        })}
      </div>
      <CountDownTimer start={Date.now()} length={activityData.config.maxTime} />
    </React.Fragment>
  );
};

const Main = withState('question', 'setQuestion', null)(props => {
  const { activityData, question, setQuestion, data } = props;
  const { questions, delay, guidelines } = activityData.config;
  const { name } = props.userInfo;
  if (question === null) {
    const start = () => setQuestion('waiting');
    return <Guidelines start={start} guidelines={guidelines} name={name} />;
  } else if (question === 'waiting') {
    const next = () => {
      setQuestion(generateExample(questions, data.progress));
    };
    return <Delay next={next} delay={delay} props={props} />;
  } else if (data.progress < questions.length) {
    return <Question {...props} />;
  } else {
    return <div style={styles.text}>Activity completed! Thank you</div>;
  }
});

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { data, activityData } = props;
  const { questions } = activityData.config;
  const p = Math.round(data.progress / questions.length * 100);

  return (
    <div style={styles.main}>
      <ProgressBar now={p} label={`${p}%`} />
      <div style={styles.container}>
        <Main {...props} />
      </div>
    </div>
  );
};

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  componentWillUnmount() {
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
