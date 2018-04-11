import * as React from 'react';
import Button from 'material-ui/Button';
import { sample, shuffle, isEqual } from 'lodash';
import { Form, Command, DragDrop, Graphical } from './Interfaces';

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

class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.instanceCount = 0;
    this.timeOfEachInstance = this.props.activityData.config.timeOfEachInstance;

    this.state = {
      ticket: generateTicket(),
      secondsRemaining: 2,
      interval: false,
      help: false
    };
  }

  reset = () => {
    this.setState({
      ticket: generateTicket(),
      secondsRemaining: 2,
      interval: false,
      help: false
    });
    this.startTimer();
  };

  handleHelpOpen = () => {
    this.stopTimer();
    this.setState({ help: true });
  };

  handleHelpClose = () => {
    this.startTimer();
    this.setState({ help: false });
  };

  startTimer = () => {
    this.noAnswerTimeOut = setInterval(() => {
      this.checkAnswer(undefined);
    }, this.state.secondsRemaining * 1000);

    this.interval = setInterval(this.tick, 1000);
  };

  stopTimer = () => {
    clearTimeout(this.noAnswerTimeOut);
    clearInterval(this.interval);
  };

  tick = () => {
    this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
    if (this.state.secondsRemaining <= 0) {
      this.stopTimer();
    }
  };

  nextInstance = () => {
    const { dataFn } = this.props;

    if (this.instanceCount > 2) {
      this.instanceCount = 0;
      dataFn.numIncr(1, 'step');
      dataFn.objInsert(true, 'guidelines');
    } else {
      this.instanceCount += 1;
      this.reset();
    }
  };

  checkAnswer = answer => {
    const { logger } = this.props;

    logger([
      {
        type: 'answer',
        payload: { answer: isEqual(this.state.ticket, answer) }
      }
    ]);

    this.stopTimer();
    // this.setState({ interval: true });
  };

  componentDidMount() {
    this.startTimer();
  }

  render() {
    const { ticket } = this.state;
    const { activity } = this.props;
    console.log(this.state.interval);

    if (this.state.interval) {
      return <Interval nextInstance={this.nextInstance} />;
    }

    return (
      <React.Fragment>
        <RunActivity
          activity={activity}
          ticket={getCommandForTicket(ticket)}
          submit={this.checkAnswer}
          help={this.state.help}
          onHelpOpen={this.handleHelpOpen}
          onHelpClose={this.handleHelpClose}
          ticker={this.state.secondsRemaining}
        />
      </React.Fragment>
    );
  }
}

export default Interface;
