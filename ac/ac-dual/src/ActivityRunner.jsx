import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';
import { styles, texts, Guidelines, CountDownTimer } from './ActivityUtils';
import Symmetry from './Symmetry';
import Game from './Game';

let noAnswerTimeout;
let delayTimeout;
let changeActivityTimeout;

const Activity = withState('ready', 'setReady', false)(props => {
  const { data: { step }, dataFn, activityData, logger } = props;
  const { ready, setReady } = props;
  const { timeOfEachActivity } = activityData.config;
  const activityTime = (timeOfEachActivity || 30000) * (step > 1 ? 2 : 1);

  const nextStep = () => {
    setReady(false);
    dataFn.numIncr(1, 'step');
    logger({ type: 'progress', value: (step + 1) / 4 });
  };

  const startActivity = () => {
    setReady(true);
    clearTimeout(changeActivityTimeout);
    changeActivityTimeout = setTimeout(nextStep, activityTime);
  };

  if (!ready) {
    return (
      <Guidelines start={startActivity} guidelines={texts.guidelines[step]} />
    );
  } else {
    return (
      <React.Fragment>
        <ActivityWithSpeed {...props} />
        <div style={styles.activityCountdown}>
          <CountDownTimer start={Date.now()} length={activityTime}>
            {texts.timeLeft}
          </CountDownTimer>
        </div>
      </React.Fragment>
    );
  }
});

class ActivityWithSpeed extends React.Component<any, any> {
  speedIncreaseInterval: any;

  constructor(props) {
    super(props);
    this.state = { speed: 3 };
  }

  componentDidMount() {
    this.speedIncreaseInterval = setInterval(
      () => this.setState({ speed: this.state.speed + 1 }),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this.speedIncreaseInterval);
  }

  render() {
    const { data: { step } } = this.props;
    const { speed } = this.state;

    return (
      <React.Fragment>
        <div style={styles.text}>{texts.guidelines[step]}</div>
        <div style={{ display: 'flex' }}>
          {(step === 1 || step === 2 || step === 3) && (
            <Game {...this.props} width={500} height={400} speed={speed} />
          )}
          {(step === 0 || step === 2 || step === 3) && (
            <Symmetry {...this.props} width={200} height={300} speed={speed} />
          )}
        </div>
      </React.Fragment>
    );
  }
}

const Main = props => {
  const { data } = props;
  const { step } = data;

  if (step < 4) {
    return <Activity {...props} />;
  } else {
    return <div style={styles.text}>{texts.end}</div>;
  }
};

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { step } = props.data;
  const p = Math.round(step / 4 * 100);
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
