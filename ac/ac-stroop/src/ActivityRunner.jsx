// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar, Button } from 'react-bootstrap';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';

const styles = {
  button: { width: '70px', margin: 'auto', position: 'absolute' },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  container: {
    width: '500px',
    height: '400px',
    margin: 'auto',
    marginTop: '80px'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bbb',
    position: 'absolute'
  },
  commands: {
    width: '200px',
    height: '50px',
    margin: 'auto',
    position: 'relative',
    marginTop: '50px'
  }
};

const randIndex = max => Math.round(max * Math.random() - 0.5);

// returns an index different than `toAvoid`
const notIndex = (max, toAvoid) => (1 + toAvoid + randIndex(max - 1)) % max;

const generateExample = (objects, colors) => {
  const N = objects.length;

  const isConsistent = Math.random() < 0.5;
  const isCorrect = Math.random() < 0.5;

  const objectIndex = randIndex(N);
  const colorIndex = isCorrect ? objectIndex : notIndex(N, objectIndex);
  const colorFillIndex = isConsistent ? colorIndex : notIndex(N, colorIndex);

  const objectName = objects[objectIndex];
  const colorName = colors[colorIndex];
  const colorFill = colors[colorFillIndex];

  const startTime = Date.now();

  return {
    isConsistent,
    isCorrect,
    objectName,
    colorName,
    colorFill,
    startTime
  };
};

const Start = withState('ready', 'setReady', false)(
  ({ ready, setReady, start, guidelines }) => (
    <div style={styles.container}>
      {!ready && <div style={styles.text}>Answer the following form</div>}
      {!ready && (
        <div style={styles.commands}>
          <Button
            style={{ ...styles.button, width: '100%' }}
            onClick={() => setReady(true)}
          >
            Submit
          </Button>
        </div>
      )}
      {ready && <div style={styles.text}>{guidelines}</div>}
      {ready && (
        <div style={styles.commands}>
          <Button style={{ ...styles.button, width: '100%' }} onClick={start}>
            Start
          </Button>
        </div>
      )}
    </div>
  )
);

let noAnswerTimeout;
let delayTimeout;

const Delay = ({ next, delay }) => {
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return <div style={styles.text}>Waiting for next question</div>;
};

const Question = props => {
  const { setQuestion, question, progress, setProgress, logger } = props;
  const { objectName, colorName, colorFill } = question;

  const onClick = answer => () => {
    clearTimeout(noAnswerTimeout);
    const answerTime = Date.now();
    logger({ type: 'answer', payload: { ...question, answer, answerTime } });
    logger({ type: 'progress', value: progress + 1 });
    setProgress(progress + 1);
    setQuestion('waiting');
  };

  Mousetrap.bind('y', onClick(true));
  Mousetrap.bind('n', onClick(false));

  clearTimeout(noAnswerTimeout);
  noAnswerTimeout = setTimeout(onClick(undefined), 10000);

  return (
    <React.Fragment>
      <div style={styles.text}>
        The color of {objectName} is{' '}
        <span style={{ color: colorFill }}>{colorName}</span>
      </div>
      <div style={styles.commands}>
        <Button style={{ ...styles.button, left: 0 }} onClick={onClick(true)}>
          Yes
        </Button>
        <Button style={{ ...styles.button, right: 0 }} onClick={onClick(false)}>
          No
        </Button>
      </div>
    </React.Fragment>
  );
};

const Main = withState('question', 'setQuestion', null)(props => {
  const { activityData, question, setQuestion } = props;
  const { colors, objects, delay, guidelines } = activityData.config;
  const colorList = colors.split(',');
  const objectList = objects.split(',');
  const next = () => {
    setQuestion(generateExample(objectList, colorList));
  };
  const start = () => setQuestion('waiting');
  if (!question) {
    return <Start start={start} guidelines={guidelines} />;
  } else if (question === 'waiting') {
    return <Delay next={next} delay={delay} />;
  } else {
    return <Question {...props} />;
  }
});

// the actual component that the student sees
const Runner = withState('progress', 'setProgress', 0)(
  (props: ActivityRunnerT) => {
    const { logger, progress, activityData } = props;
    const { maxQuestions } = activityData.config;
    const p = Math.round(progress / maxQuestions * 100);
    if (progress < maxQuestions) {
      return (
        <div style={styles.main}>
          <ProgressBar now={p} label={`${p}%`} />
          <div style={styles.container}>
            <Main {...props} />
          </div>
        </div>
      );
    } else {
      logger({ type: 'completed' });
      return (
        <div style={styles.main}>
          <div style={styles.container}>
            <div style={styles.text}>Activity Completed!</div>
          </div>
        </div>
      );
    }
  }
);

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  componentWillUnmount() {
    Mousetrap.reset();
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    this.props.logger({ type: 'start' });
    return <Runner {...this.props} />;
  }
}
