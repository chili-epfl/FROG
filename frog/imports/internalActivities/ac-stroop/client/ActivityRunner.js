// @flow

import * as React from 'react';
import { type ActivityRunnerPropsT, TimedComponent } from '/imports/frog-utils';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';
import { Button, LinearProgress } from '@material-ui/core';
import hardcodedList from './hardcodedList';

const styles = {
  button: { width: '90px', margin: 'auto', position: 'absolute' },
  text: { width: '100%', fontSize: 'large', textAlign: 'center' },
  guidelines: { width: '100%', fontSize: 'large' },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    width: '500px',
    maxWidth: '100%',
    flex: '1 1 auto',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  commands: {
    width: '250px',
    maxWidth: '100%',
    height: '50px',
    position: 'relative'
  }
};

const generateExample = (progress, lang) => {
  const ex = hardcodedList[progress % hardcodedList.length];
  const { isConsistent, isCorrect, colorFill } = ex;
  const { objectName, colorName } = ex[lang];
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

const texts = {
  en: {
    start: 'Start',
    yes: 'YES',
    no: 'NO',
    colorSentence: name => `The color of ${name} is `,
    wait: 'Waiting for next question',
    end: 'Activity completed! Thank you'
  },
  fr: {
    start: 'Commencer',
    yes: 'OUI',
    no: 'NON',
    colorSentence: name => `La couleur du ${name} est `,
    wait: 'Attendez la question suivante',
    end: 'Activité terminée! Merci'
  }
};

let noAnswerTimeout;
let delayTimeout;

const Form = withState(
  'language',
  'setLanguage',
  null
)(({ language, setLanguage, onSubmit, name }) => (
  <>
    <div style={styles.text}>Welcome {name}!</div>
    <div style={styles.text}>Choisis ton langage</div>
    <div style={styles.text}>Choose your language</div>
    <div style={styles.commands}>
      <Button
        variant="contained"
        style={{ ...styles.button, left: 0 }}
        color={language === 'fr' ? 'primary' : undefined}
        onClick={() => setLanguage('fr')}
      >
        Français
      </Button>
      <Button
        variant="contained"
        style={{ ...styles.button, right: 0 }}
        color={language === 'en' ? 'primary' : undefined}
        onClick={() => setLanguage('en')}
      >
        English
      </Button>
    </div>
    {language !== null && (
      <div style={{ ...styles.commands, width: '100px' }}>
        <Button
          variant="contained"
          style={{ ...styles.button, width: '100%' }}
          onClick={() => onSubmit(language)}
          bsStyle="primary"
        >
          Submit
        </Button>
      </div>
    )}
  </>
));

const Guidelines = ({ start, guidelines, lang }) => (
  <>
    <div style={styles.guidelines}>{guidelines}</div>
    <div style={{ ...styles.commands, width: '120px' }}>
      <Button
        variant="contained"
        style={{ ...styles.button, width: '100%' }}
        onClick={start}
      >
        {texts[lang].start}
      </Button>
    </div>
  </>
);

const CountDownTimer = TimedComponent(({ timeNow, length, start }) => {
  const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
  return <div style={styles.text}>{timeLeft + ' s'}</div>;
}, 100);

const Delay = ({ next, delay, lang }) => {
  clearTimeout(delayTimeout);
  delayTimeout = setTimeout(next, delay);
  return (
    <>
      <div style={styles.text}>{texts[lang].wait}</div>
      <CountDownTimer start={Date.now()} length={delay} />
    </>
  );
};

const Question = props => {
  const { setQuestion, question, logger, data, dataFn, activityData } = props;
  const { objectName, colorName, colorFill, isCorrect, startTime } = question;
  const lang = data.language;

  const onClick = answer => () => {
    clearTimeout(noAnswerTimeout);
    // Logs the question and answer provided
    const answerTime = Date.now();
    // Increases the progress and logs the new progress
    dataFn.numIncr(1, 'progress');
    // Increases the score and logs the new score
    const isCorrectAnswer = isCorrect === answer ? 1 : 0;
    const timeIncr = Date.now() - startTime;
    const value = [data.score + isCorrectAnswer, -(data.time + timeIncr)];
    logger([
      { type: 'answer', payload: { ...question, answer, answerTime } },
      {
        type: 'progress',
        value: (data.progress + 1) / activityData.config.maxQuestions
      },
      { type: 'score', value }
    ]);
    dataFn.numIncr(isCorrectAnswer, 'score');
    dataFn.numIncr(timeIncr, 'time');
    // Goes on to next question
    setQuestion('waiting');
    Mousetrap.reset();
  };

  Mousetrap.bind('y', onClick(true));
  Mousetrap.bind('o', onClick(true));
  Mousetrap.bind('n', onClick(false));

  clearTimeout(noAnswerTimeout);
  noAnswerTimeout = setTimeout(onClick(undefined), activityData.config.maxTime);

  return (
    <>
      <div style={styles.text}>
        {texts[lang].colorSentence(objectName)}
        <span style={{ color: colorFill }}>{colorName}</span>
      </div>
      <div style={styles.commands}>
        <Button
          variant="contained"
          style={{ ...styles.button, left: 0 }}
          onClick={onClick(true)}
        >
          {texts[lang].yes}
        </Button>
        <Button
          variant="contained"
          style={{ ...styles.button, right: 0 }}
          onClick={onClick(false)}
        >
          {texts[lang].no}
        </Button>
      </div>
      <CountDownTimer start={Date.now()} length={activityData.config.maxTime} />
    </>
  );
};

const Main = withState(
  'question',
  'setQuestion',
  null
)(props => {
  const { activityData, question, setQuestion, data, dataFn, logger } = props;
  const { maxQuestions, delay } = activityData.config;
  const lang = data.language;
  const { name } = props.userInfo;
  if (!lang) {
    return <Form onSubmit={l => dataFn.objInsert(l, 'language')} name={name} />;
  } else if (question === null) {
    const start = () => {
      setQuestion('waiting');
      logger([
        {
          type: 'progress',
          value: data.progress / hardcodedList.length
        }
      ]);
    };
    const { guidelines } = activityData.config[lang];
    return <Guidelines start={start} guidelines={guidelines} lang={lang} />;
  } else if (question === 'waiting') {
    const next = () => {
      setQuestion(generateExample(data.progress, lang));
    };
    return <Delay next={next} delay={delay} props={props} lang={lang} />;
  } else if (data.progress < maxQuestions) {
    return <Question {...props} />;
  } else {
    return <div style={styles.text}>{texts[lang].end}</div>;
  }
});

// the actual component that the student sees
const Runner = (props: ActivityRunnerPropsT) => {
  const { data, activityData } = props;
  const { maxQuestions } = activityData.config;
  const p = Math.round((data.progress / maxQuestions) * 100);
  return (
    <div style={styles.main}>
      <LinearProgress variant="determinate" value={p} />
      <div style={styles.container}>
        <Main {...props} />
      </div>
    </div>
  );
};

export default class ActivityRunner extends React.Component<ActivityRunnerPropsT> {
  componentWillUnmount() {
    Mousetrap.reset();
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
