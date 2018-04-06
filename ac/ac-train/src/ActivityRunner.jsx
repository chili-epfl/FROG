import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';

import { sample, shuffle } from 'lodash';
import ReactTimeout from 'react-timeout';
import Help from './Help';

import Command from './Activities/Command';

import {
  styles,
  texts,
  Guidelines,
  CountDownTimer,
  CliGuidelines
} from './ActivityUtils';

let noAnswerTimeout;
let delayTimeout;
let changeInstanceTimeout;

const cities = [
  'Geneve',
  'Lausanne',
  'Zurich',
  'Fribourg',
  'Basel',
  'Neuchatel',
  'Davos'
];

const fares = ['standard', 'young', 'half-fare'];
const travel = ['one-way', 'return'];
// const bike = ['yes', 'no'];
// const totalTasks = 20;
// const subtasksPerInterface = totalTasks / interfaces.length;

// let ticketStructure = {};

// const generateTicket = () => {
//   const randFrom = sample(cities);
//   const randTo = sample(cities.filter(city => city !== randFrom));

//   ticketStructure = {
//     from: randFrom,
//     to: randTo,
//     travel: sample(travel),
//     bike: Math.random() > 0.5,
//     fare: sample(fares)
//   };
// };

const RunActivity = ({ activity, ticket, submit, helpOpen, helpClose }) => {
  switch (activity) {
    case 'command':
      return (
        <React.Fragment>
          <Command ticket={ticket} submit={submit} />
          <Help onOpen={helpOpen} onClose={helpClose}>
            <CliGuidelines />
          </Help>
        </React.Fragment>
      );
    default:
      return <h1>Hello World</h1>;
  }
};

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.instanceCount = 0;
    this.timeOfEachInstance = this.props.activityData.config.timeOfEachInstance;
    // this.interfaces = shuffle(['dragdrop', 'command', 'graphical', 'form']);
    this.changeInstanceTimer = null;
    this.interfaces = shuffle(['command']);
    this.state = { guidelines: true, ticket: this.generateTicket() };
  }

  getCommandForTicket = ticket =>
    `Please order a ${ticket.fare} ${ticket.travel} ${
      ticket.travelClass === 0 ? '1st class ticket' : '2nd class ticket'
    } ${ticket.bike ? 'with a bike' : 'without bike'} .`;

  generateTicket = () => {
    const randFrom = sample(cities);
    const randTo = sample(cities.filter(city => city !== randFrom));

    return {
      from: randFrom,
      to: randTo,
      travel: sample(travel),
      bike: Math.random() > 0.5,
      fare: sample(fares)
    };
  };

  handleHelpOpen = () => {
    console.log('Help Open');
  };

  handleHelpClose = () => {
    console.log('help close');
  };

  nextInstance = () => {
    if (this.instanceCount > 4) {
      this.instanceCount = 0;
      this.setState({ guidelines: true });
    } else {
      this.instanceCount += 1;
      this.timer();
      this.setState({ ticket: this.generateTicket() });
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
    const { dataFn } = this.props;

    dataFn.numIncr(1, 'step');
    this.timer();
    this.setState({ guidelines: false });
  };

  checkAnswer = answer => {
    console.log('will check answer here -> now move to next instance');

    this.nextInstance();
  };

  render() {
    const { guidelines } = this.state;
    const { data: { step } } = this.props;

    if (guidelines) {
      return <Guidelines beginActivity={this.beginActivity} step={step} />;
    } else {
      return (
        <React.Fragment>
          <RunActivity
            activity={this.interfaces[0]}
            ticket={this.getCommandForTicket(this.state.ticket)}
            submit={this.checkAnswer}
            helpOpen={this.handleHelpOpen}
            helpClose={this.handleHelpClose}
          />
          <div style={styles.activityCountdown}>
            {/* <CountDownTimer start={Date.now()} length={this.timeOfEachInstance}>
              {texts.timeLeft}
            </CountDownTimer> */}
          </div>
        </React.Fragment>
      );
    }
  }
}

const EnhancedActivity = ReactTimeout(Activity);

const Main = props => {
  const { data } = props;
  const { step } = data;

  if (step < 4) {
    return <EnhancedActivity {...props} />;
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
  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
