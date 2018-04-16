// @ flow
import React from 'react';

// UI
import { isEqual } from 'lodash';

import { Form, Command, DragDrop, Graphical } from './Interfaces';
import Validation from './Validation';
import { getCommandForTicket, generateTicket, testing } from './ActivityUtils';

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

class Interface extends React.Component {
  constructor(props) {
    super(props);
    this.instanceCount = 0;
    this.timeOfEachInstanceInSec =
      this.props.activityData.config.timeOfEachInstance / 1000;

    this.initialState = {
      question: generateTicket(),
      checkAnswer: false,
      start: Date.now(),
      secondsRemaining: this.timeOfEachInstanceInSec,
      interval: false,
      help: false
    };

    this.helpCount = 0;

    this.state = { ...this.initialState };
  }

  reset = () => {
    this.setState({
      ...this.initialState,
      start: Date.now(),
      question: generateTicket()
    });
    this.startTimer();
  };

  handleHelpOpen = () => {
    const { logger } = this.props;

    this.helpCount += 1;

    logger([
      {
        type: 'help',
        payload: { help: this.helpCount }
      }
    ]);

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
    const { dataFn, activityData } = this.props;

    if (this.instanceCount === 4) {
      this.instanceCount = 0;
      dataFn.numIncr(1, 'step');
      dataFn.objInsert(true, 'guidelines');
    } else {
      this.instanceCount += 1;
      this.reset();
    }
  };

  checkAnswer = answer => {
    const { logger, activity } = this.props;
    const { question, start } = this.state;
    // console.log(this.state.ticket);
    // console.log(answer);
    const checkAnswer = isEqual(question, answer);

    logger([
      {
        type: 'answer',
        payload: {
          activity,
          iteration: this.instanceCount,
          checkAnswer,
          timeTaken: Date.now() - start
        }
      }
    ]);

    this.stopTimer();
    if (true) {
      this.setState({ interval: true, checkAnswer });
    }
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const { question, checkAnswer } = this.state;
    const { activity } = this.props;

    if (this.state.interval) {
      return (
        <Validation
          nextInstance={this.nextInstance}
          checkAnswer={checkAnswer}
        />
      );
    }

    return (
      <React.Fragment>
        <RunActivity
          activity={activity}
          ticket={getCommandForTicket(question)}
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
