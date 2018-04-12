// @flow

import * as React from 'react';

// UI
import { sample } from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

const styles = {
  interval: {
    height: '100%'
  }
};

export const texts = {
  start: 'Start',
  yes: 'YES',
  no: 'NO',
  guidelines: [
    'Are the two shapes symmetrical? Click Yes or No to answer. ' +
      'You can also use the Keyboard: Y/O for Yes and N for No.',
    'Do not let the ball fall and break the bricks! Use left and right arrows to move.',
    'Now do both tasks at the same time!',
    'Now do both tasks at the same time!'
  ],
  end: 'Activity completed! Thank you!',
  timeLeft: 'Time left in Task -> '
};

export const CITIES = [
  'geneve',
  'lausanne',
  'zurich',
  'fribourg',
  'basel',
  'neuchatel',
  'davos'
];

export const FARES = ['standard', 'young', 'half-fare'];
export const TRAVELDIRECTION = ['one-way', 'return'];
export const CLASS = ['1st', '2nd'];
export const WANTBIKE = ['yes', 'no'];

export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const lowercaseFirstLetter = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1);

export function getCommandForTicket(ticket: Object) {
  return `Please order a ${ticket.fare} ${ticket.travel} ${
    ticket.class
  } class ticket from ${capitalizeFirstLetter(
    ticket.from
  )} to  ${capitalizeFirstLetter(ticket.to)} ${
    ticket.bike === 'yes' ? 'with a bike' : 'without bike'
  }.`;
}
export function generateTicket() {
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
}

type IntervalPropsT = {
  classes: Object,
  nextInstance: Function
};

class IntervalController extends React.Component<IntervalPropsT> {
  interval: TimeoutID;

  componentDidMount() {
    this.interval = setTimeout(() => {
      this.props.nextInstance();
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.interval}
      >
        <Grid item>
          <CircularProgress size={50} />
        </Grid>
      </Grid>
    );
  }
}

export const Interval = withStyles(styles)(IntervalController);

export function commandDataStructure(command: string) {
  const answer = command.split(' ').filter(t => t !== 'from' && t !== 'to');
  const cities = answer.splice(0, 2).map(city => lowercaseFirstLetter(city));

  const bikeIndex = answer.indexOf('bike');

  if (bikeIndex === 1) {
    answer[bikeIndex] = 'yes';
  } else if (bikeIndex === -1) {
    answer.splice(1, 0, 'no');
  }

  const C1 = answer.indexOf('C1');
  const C2 = answer.indexOf('C2');

  if (C1 === 2) {
    answer[C1] = '1st';
  }

  if (C2 === 2) {
    answer[C2] = '2nd';
  }

  return {
    from: cities[0],
    to: cities[1],
    fare: answer[0],
    bike: answer[1],
    class: answer[2],
    travel: answer[3]
  };
}
