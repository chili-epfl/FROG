// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';
import {
  styles,
  texts,
  Form,
  Guidelines,
  CountDownTimer
} from './ActivityUtils';
import Symmetry from './Symmetry';
import Game from './Game';

let noAnswerTimeout;
let delayTimeout;
let changeActivityTimeout;

const Activity = withState('ready', 'setReady', false)(props => {
  const { data, dataFn, activityData, ready, setReady, logger } = props;
  const { timeOfEachActivity } = activityData.config;
  const { language, step } = data;

  const nextStep = () => {
    setReady(false);
    dataFn.numIncr(1, 'step');
    logger({ type: 'progress', value: (step + 1) / 3 });
  };

  const startActivity = () => {
    setReady(true);
    clearTimeout(changeActivityTimeout);
    changeActivityTimeout = setTimeout(nextStep, timeOfEachActivity || 60000);
  };

  if (!ready) {
    return (
      <Guidelines
        start={startActivity}
        guidelines="Placeholder for guidelines"
        lang={language}
      />
    );
  } else {
    return (
      <React.Fragment>
        <div style={styles.text}>
          {texts[language].question[parseInt(step, 10)]}
        </div>
        <div style={{ display: 'flex' }}>
          {(step === 1 || step === 2) && (
            <Game {...props} width={500} height={400} step={step} />
          )}
          {(step === 0 || step === 2) && (
            <Symmetry {...props} width={200} height={300} step={step} />
          )}
        </div>
        <div style={styles.activityCountdown}>
          <CountDownTimer start={Date.now()} length={timeOfEachActivity}>
            {texts[language].timeLeft}
          </CountDownTimer>
        </div>
      </React.Fragment>
    );
  }
});

const Main = props => {
  const { data, dataFn } = props;
  const { language, step } = data;
  const { name } = props.userInfo;

  if (!language) {
    return <Form onSubmit={l => dataFn.objInsert(l, 'language')} name={name} />;
  } else if (step < 3) {
    return <Activity {...props} />;
  } else {
    return <div style={styles.text}>{texts[language].end}</div>;
  }
};

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { step } = props.data;
  const p = Math.round(step / 3 * 100);
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
    Mousetrap.reset();
    clearTimeout(delayTimeout);
    clearTimeout(noAnswerTimeout);
  }

  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
