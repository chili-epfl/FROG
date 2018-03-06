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
  CountDownTimer,
  Delay
} from './ActivityUtils';
import Symmetry from './Symmetry';
import Game from './Game';

let noAnswerTimeout;
let delayTimeout;
let changeActivityTimeout;

const Activity = props => {
  const { setTask, logger, data, dataFn, activityData } = props;
  const { timeOfEachActivity } = activityData.config;
  const { language, activityState } = data;

  const changeActivity = () => {
    dataFn.numIncr(1, 'activityState');
    // setTask('waiting');
  };

  clearTimeout(changeActivityTimeout);
  changeActivityTimeout = setTimeout(changeActivity, timeOfEachActivity);

  return (
    <React.Fragment>
      <div style={styles.text}>
        {texts[language].question[parseInt(activityState, 10)]}
      </div>
      <div style={{ display: 'flex' }}>
        {/* {(activityState === 1 || activityState === 2) && (
            <Game width={800} height={400} />
          )}
          {(activityState === 0 || activityState === 2) && (
           
          )} */}
        <Symmetry {...props} width={200} height={300} />
        {/* <Game width={500} height={400} /> */}
      </div>
      <div style={styles.activityCountdown}>
        <CountDownTimer start={Date.now()} length={timeOfEachActivity}>
          {texts[language].timeLeft}
        </CountDownTimer>
      </div>
    </React.Fragment>
  );
};

const Main = withState('task', 'setTask', null)(props => {
  const { activityData, task, setTask, data, dataFn } = props;
  const { delayBetweenActivity } = activityData.config;
  const lang = data.language;
  const { name } = props.userInfo;
  const activityState = data.activityState;

  if (!lang) {
    return <Form onSubmit={l => dataFn.objInsert(l, 'language')} name={name} />;
  } else if (task === null) {
    const start = () => setTask('waiting');
    const { guidelines } = activityData.config[lang];
    return <Guidelines start={start} guidelines={guidelines} lang={lang} />;
  } else if (task === 'waiting') {
    const next = () => {
      setTask({ startTime: Date.now() });
    };
    return (
      <Delay
        next={next}
        delay={delayBetweenActivity}
        props={props}
        lang={lang}
      />
    );
  } else {
    return <Activity {...props} />;
  }
  // else if (activityState < 3) {
  //
  // } else {
  //   return <div style={styles.text}>{texts[lang].end}</div>;
  // }
});

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { activityState } = props.data;
  const p = Math.round(activityState / 3 * 100);
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
