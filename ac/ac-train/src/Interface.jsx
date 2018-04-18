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
      isCorrect: false,
      start: Date.now(),
      secondsRemaining: this.timeOfEachInstanceInSec,
      interval: false,
      help: false
    };

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
    const { logger, activity } = this.props;

    logger([
      {
        type: 'help',
        payload: { activity }
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
    const { dataFn, logger, data } = this.props;
    dataFn.numIncr(1, 'instance');
    const {
      data: { instance }
    } = this.props;

    logger([
      {
        type: 'progress',
        value: (instance + 1) / 20
      }
    ]);

    if (instance % 5 === 0) {
      dataFn.numIncr(1, 'step');
      dataFn.objInsert(true, 'guidelines');
    } else {
      this.reset();
    }
  };

  checkAnswer = answer => {
    const {
      logger,
      activity,
      data: { instance }
    } = this.props;

    const { question, start } = this.state;
    const isCorrect = isEqual(question, answer);

    logger([
      {
        type: 'answer',
        payload: {
          activity,
          instance,
          isCorrect,
          timeTaken: Date.now() - start
        }
      }
    ]);

    this.stopTimer();
    this.setState({ interval: true, isCorrect });
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const {
      question,
      isCorrect,
      interval,
      help,
      secondsRemaining
    } = this.state;

    const {
      activity,
      activityData: {
        config: { intervalTime }
      }
    } = this.props;

    if (interval) {
      return (
        <Validation
          nextInstance={this.nextInstance}
          isCorrect={isCorrect}
          time={intervalTime}
        />
      );
    }

    return (
      <React.Fragment>
        <RunActivity
          activity={activity}
          ticket={getCommandForTicket(question)}
          submit={this.checkAnswer}
          help={help}
          onHelpOpen={this.handleHelpOpen}
          onHelpClose={this.handleHelpClose}
          ticker={secondsRemaining}
        />
      </React.Fragment>
    );
  }
}

export default Interface;
