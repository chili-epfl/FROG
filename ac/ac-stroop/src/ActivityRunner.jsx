// @flow

import * as React from 'react'
import { type ActivityRunnerT } from 'frog-utils';
import { Button } from 'react-bootstrap';
import { withState } from 'recompose';

const styles = {
  button: { width: '70px', margin: 'auto', position: 'absolute' },
  text: { width: '100%', fontSize: 'xx-large', textAlign: 'center' },
  container: {
    width: '500px',
    height: '400px',
    margin: 'auto',
    marginTop: '80px'
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

  const startTime = Date.now()

  return { isConsistent, isCorrect, objectName, colorName, colorFill, startTime };
};

const Start = ({ start, guidelines }) =>
  <div style={styles.container}>
    <div style={styles.text}>
      {guidelines}
    </div>
    <div style={styles.commands}>
      <Button
        style={{ ...styles.button, width: '100%'}}
        onClick={start}
      >
        Start
      </Button>
    </div>
  </div>


const Question = withState('question', 'setQuestion', null)((props) => {
  const { activityData, question, setQuestion } = props
  const { colors, objects } = activityData.config
  const colorList = colors.split(',')
  const objectList = objects.split(',')

  const nextQuestion = () => {
    setQuestion(generateExample(objectList, colorList))
  }

  if (question === null) {
    return (
      <Start
        start={nextQuestion}
        guidelines="fsfdgsdjsjfdfh"
      />)
  }

  const { objectName, colorName, colorFill } = question
  const { logger } = props
  const onClick = (answer) => (() => {
    const answerTime = Date.now()
    logger({ type: 'answer', payload: { ...question, answer, answerTime } })
    nextQuestion()
  })
  return (
    <div style={styles.container}>
      <div style={styles.text}>
      The color of {objectName} is{' '}
        <span style={{ color: colorFill }}>{colorName}</span>
      </div>
      <div style={styles.commands}>
        <Button
          style={{ ...styles.button, left: 0 }}
          onClick={onClick(true)}
        >
          Yes
        </Button>
        <Button
          style={{ ...styles.button, right: 0 }}
          onClick={onClick(false)}
        >
          No
        </Button>
      </div>
    </div>
  );
})

// the actual component that the student sees
export default (props: ActivityRunnerT) => {
  props.logger({ type: 'start' })
  return (
    <Question {...props} />
  );
};
