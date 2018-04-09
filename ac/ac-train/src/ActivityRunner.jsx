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
  CountDownTimer,
  SpecificGuidelines,
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

const getCommandForTicket = ticket =>
  `Please order a ${ticket.fare} ${ticket.travel} ${
    ticket.travelClass === 0 ? '1st class ticket' : '2nd class ticket'
  } ${ticket.bike ? 'with a bike' : 'without bike'} .`;

const generateTicket = () => {
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

class Activity extends React.Component {
  constructor(props) {
    super(props);
    this.instanceCount = 0;
    this.timeOfEachInstance = this.props.activityData.config.timeOfEachInstance;
    // this.interfaces = shuffle(['dragdrop', 'command', 'graphical', 'form']);
    this.changeInstanceTimer = null;
    this.interfaces = ['start', ...shuffle(['command'])];
    this.state = { guidelines: true, ticket: generateTicket() };
  }

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
    const { dataFn, data: { step } } = this.props;
    dataFn.numIncr(1, 'step');
    if (step > 1) {
      this.setState({ guidelines: false });
    }
    //
  };

  checkAnswer = answer => {
    console.log('will check answer here -> now move to next instance');

    this.nextInstance();
  };

  render() {
    const { guidelines, ticket } = this.state;
    const { data: { step } } = this.props;
    console.log(this.interfaces);

    if (guidelines) {
      return (
        <SpecificGuidelines
          beginActivity={this.beginActivity}
          activity={this.interfaces[step]}
        />
      );
    } else {
      return (
        <React.Fragment>
          <RunActivity
            activity={this.interfaces[step]}
            ticket={getCommandForTicket(ticket)}
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
  const { step } = props.data;

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
  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
