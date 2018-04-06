import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';
import { withState } from 'recompose';
import Mousetrap from 'mousetrap';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { sample, shuffle } from 'lodash';
import Help from './Help';
import {
  styles,
  texts,
  Guidelines,
  CountDownTimer,
  CliGuidelines
} from './ActivityUtils';

// import Symmetry from './Symmetry';
// import Game from './Game';

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

class CLIActivity extends React.Component {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = () => {
    console.log('HandleSubmit of CliActivity called');
    // const fullAnswer = this.state.text
    //   .split(' ')
    //   .filter(item => item !== 'from' && item !== 'to');
    // const fromTo = fullAnswer.slice(0, 2);

    // const ticket = {
    //   from: answer[0],
    //   to: answer[1],
    //   fare: answer[2]
    // };
    this.props.submit();
  };

  render() {
    const { ticket } = this.props;
    return (
      <React.Fragment>
        <Typography gutterBottom>{ticket}</Typography>
        <TextField
          id="multiline-flexible"
          label="Enter command"
          value={this.state.text}
          onChange={this.handleChange}
          multiline
          rowsMax="4"
          fullWidth
          margin="normal"
        />
        <Button color="primary" onClick={this.handleSubmit}>
          Buy
        </Button>
      </React.Fragment>
    );
  }
}

const RunActivity = ({ activity, ticket, submit, helpOpen, helpClose }) => {
  switch (activity) {
    case 'command':
      return (
        <React.Fragment>
          <CLIActivity ticket={ticket} submit={submit} />
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
      this.setState({ ticket: this.generateTicket() });
    }
  };

  beginActivity = () => {
    const { dataFn } = this.props;
    dataFn.numIncr(1, 'step');
    this.setState({ guidelines: false });
  };

  checkAnswer = answer => {
    console.log('will check answer here -> now move to next instance');

    this.nextInstance();
  };

  render() {
    console.log(this.state);
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
            <CountDownTimer start={Date.now()} length={this.timeOfEachInstance}>
              {texts.timeLeft}
            </CountDownTimer>
          </div>
        </React.Fragment>
      );
    }
  }
}

// const Activity = withState('ready', 'setReady', false)(props => {
//   const { data: { step }, dataFn, activityData, logger } = props;
//   const { ready, setReady } = props;
//   const { timeOfEachInstance } = activityData.config;

//   const nextStep = () => {
//     setReady(false);
//     dataFn.numIncr(1, 'step');
//     logger({ type: 'progress', value: (step + 1) / 4 });
//   };

//   const startActivity = () => {
//     setReady(true);
//     clearTimeout(changeInstanceTimeout);
//     changeInstanceTimeout = setTimeout(nextStep, timeOfEachInstance);
//   };

//   const handleSubmit = (activity, value) => () => {
//     console.log(activity, value);
//   };

//   if (!ready) {
//     return <Guidelines start={startActivity} step={step} />;
//   } else {
//     return (
//       <React.Fragment>
//         <CLIActivity
//           ticket={getCommandForTicket(generateTicket())}
//           submit={handleSubmit}
//         />
//         <div style={styles.activityCountdown}>
//           <CountDownTimer start={Date.now()} length={timeOfEachInstance}>
//             {texts.timeLeft}
//           </CountDownTimer>
//         </div>
//       </React.Fragment>
//     );
//   }
// });

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
