import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';

import { sample, shuffle, isEqual } from 'lodash';
import ReactTimeout from 'react-timeout';

import { Form, Command, DragDrop, Graphical } from './Interfaces';
import {
  StartingGuidelines,
  CliGuidelines,
  FormGuidelines
} from './Guidelines';
import Help from './Help';

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

const RunActivity = ({
  activity,
  ticket,
  guidelines,
  help,
  submit,
  helpOpen,
  helpClose
}) => {
  switch (activity) {
    case 'command':
      return (
        <React.Fragment>
          {!guidelines && <Command ticket={ticket} submit={submit} />}
          <Help onOpen={helpOpen} onClose={helpClose} open={help}>
            <CliGuidelines />
          </Help>
        </React.Fragment>
      );
    case 'form':
      return (
        <React.Fragment>
          {!guidelines && <Form ticket={ticket} submit={submit} />}
          <Help onOpen={helpOpen} onClose={helpClose} open={help}>
            <FormGuidelines />
          </Help>
        </React.Fragment>
      );
    case 'dragdrop':
      return (
        <React.Fragment>
          {!guidelines && <DragDrop ticket={ticket} submit={submit} />}
          <Help onOpen={helpOpen} onClose={helpClose} open={help}>
            <FormGuidelines />
          </Help>
        </React.Fragment>
      );
    case 'graphical':
      return (
        <React.Fragment>
          {!guidelines && <Graphical ticket={ticket} submit={submit} />}
          <Help onOpen={helpOpen} onClose={helpClose} open={help}>
            <FormGuidelines />
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
    this.changeInstanceTimer = null;
    // this.interfaces = ['start', ...shuffle(['command'])];
    this.interfaces = ['start', ...shuffle(['graphical'])];
    this.state = {
      ticket: generateTicket(),
      help: false,
      guidelines: false,
      timer: false
    };
  }

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

    this.setState({ guidelines: true, help: true });
  };

  checkAnswer = answer => {
    const checkAnswerIfCorrect = isEqual(this.state.ticket, answer);

    console.log(`Answer is ${checkAnswerIfCorrect}`);
    // this.nextInstance();
  };

  render() {
    const { ticket } = this.state;
    const { data: { step } } = this.props;
    console.log(this.interfaces);

    if (this.interfaces[step] === 'start') {
      return (
        <StartingGuidelines
          beginActivity={this.beginActivity}
          activity={this.interfaces[step]}
        />
      );
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

// const EnhancedActivity = ReactTimeout(Activity);

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
