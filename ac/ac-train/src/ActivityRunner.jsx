import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';

import { sample, shuffle, isEqual } from 'lodash';
import ReactTimeout from 'react-timeout';
import Button from 'material-ui/Button';

import { Form, Command, DragDrop, Graphical } from './Interfaces';
import { SpecificGuidelines } from './Guidelines';

import {
  styles,
  texts,
  CountDownTimer,
  CITIES,
  FARES,
  CLASS,
  TRAVELDIRECTION,
  WANTBIKE,
  capitalizeFirstLetter
} from './ActivityUtils';

let noAnswerTimeout;
let delayTimeout;
let changeInstanceTimeout;

const getCommandForTicket = ticket =>
  `Please order a ${ticket.fare} ${ticket.travel} ${
    ticket.class
  } class ticket from ${capitalizeFirstLetter(
    ticket.from
  )} to  ${capitalizeFirstLetter(ticket.to)} ${
    ticket.bike === 'yes' ? 'with a bike' : 'without bike'
  } .`;

const generateTicket = () => {
  const randomFrom = sample(CITIES);
  const randomTo = sample(CITIES.filter(city => city !== randomFrom));

  return {
    from: randomFrom,
    to: randomTo,
    travel: sample(TRAVELDIRECTION),
    class: sample(CLASS),
    bike: sample(WANTBIKE),
    fare: sample(FARES)
  };
};

const RunActivity = props => {
  switch (props.activity) {
    case 'command':
      return <Command {...props} />;
    case 'form':
      return <Form {...props} />;
    case 'dragdrop':
      return <DragDrop {...props} />;
    case 'graphical':
      return <Graphical {...props} />;
    default:
      return <h1>Hello World</h1>;
  }
};

class Interval extends React.Component {
  constructor() {
    super();
    this.interval = null;
  }

  componentDidMount() {
    this.interval = setTimeout(() => {
      this.props.nextInstance();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <CountDownTimer start={Date.now()} length={1000}>
          {texts.timeLeft}
        </CountDownTimer>
      </div>
    );
  }
}

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.instanceCount = 0;
    this.timeOfEachInstance = this.props.activityData.config.timeOfEachInstance;
    this.changeInstanceTimer = null;
    this.interfaces = shuffle(['graphical', 'dragdrop', 'command', 'form']);

    this.state = {
      start: true,
      ticket: generateTicket(),
      secondsRemaining: 10,
      help: false,
      timer: 6000,
      interval: false
    };
  }

  startTimer = () => {
    this.callback = setInterval(() => {
      this.nextInstance();
    }, this.state.secondsRemaining * 1000);

    this.interval = setInterval(this.tick, 1000);
  };

  pauseTimer = () => {
    clearTimeout(this.callback);
    clearInterval(this.interval);
  };

  tick = () => {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval);
      clearTimeout(this.callback);
    }
  };

  handleHelpOpen = () => {
    this.setState({ help: true });
  };

  handleHelpClose = () => {
    if (this.state.guidelines) {
      this.setState({ guidelines: false });
    }
    this.setState({ help: false });
  };

  nextInstance = () => {
    const { dataFn } = this.props;

    if (this.instanceCount > 4) {
      this.instanceCount = 0;
      this.setState({ help: true, interval: false });
      dataFn.numIncr(1, 'step');
    } else {
      this.instanceCount += 1;
      this.setState({ ticket: generateTicket(), interval: true });
      this.timer();
    }
  };

  timer = () => {
    clearTimeout(this.noAnswerTimeOut);
    this.noAnswerTimeOut = setTimeout(
      this.nextInstance,
      this.timeOfEachInstance
    );
  };

  beginActivity = () => {
    this.setState({ start: false, help: true });
    this.timer();
  };

  checkAnswer = answer => {
    const checkAnswerIfCorrect = isEqual(this.state.ticket, answer);

    console.log(`Answer is ${checkAnswerIfCorrect}`);

    this.setState({ interval: true });
  };

  render() {
    const { ticket } = this.state;
    const { data: { step } } = this.props;

    if (this.state.start) {
      return <StartingGuidelines beginActivity={this.beginActivity} />;
    }

    if (this.state.interval) {
      return <Interval nextInstance={this.nextInstance} />;
    }

    return (
      <React.Fragment>
        <RunActivity
          activity={this.interfaces[step]}
          ticket={getCommandForTicket(ticket)}
          submit={this.checkAnswer}
          guidelines={this.state.guidelines}
          help={this.state.help}
          helpOpen={this.handleHelpOpen}
          helpClose={this.handleHelpClose}
        />
        <div style={styles.activityCountdown}>
          <CountDownTimer start={Date.now()} length={this.timeOfEachInstance}>
            {texts.timeLeft}
          </CountDownTimer>
        </div>
      </React.Fragment>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.interfaces = [
      'start',
      ...shuffle(['graphical', 'dragdrop', 'command', 'form'])
    ];

    this.state = {
      guidelines: true
    };
  }

  start = () => {
    const { dataFn } = this.props;
    dataFn.numIncr(1, 'step');
    this.setState({ guidelines: false });
  };

  beginActivity = () => {
    const { dataFn } = this.props;
    dataFn.numIncr(1, 'step');
  };

  render() {
    const { step } = this.props.data;

    if (this.state.guidelines) {
      return (
        <SpecificGuidelines
          activity={this.interfaces[step]}
          start={step === 0 ? this.beginActivity : this.start}
        />
      );
    }

    if (step < 5) {
      return <h1> YOOOO </h1>;
      // return <Activity interface={this.interfaces[step]} {...this.props} />;
    } else {
      return <div style={styles.text}>{texts.end}</div>;
    }
  }
}

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { step } = props.data;
  const p = Math.round(step / 5 * 100);
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
  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
