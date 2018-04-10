// @flow

import * as React from 'react';
import { TimedComponent, HTML } from 'frog-utils';

export const styles = {
  button: { width: '120px', margin: '0 5px' },
  text: { fontSize: 'xx-large' },
  main: {
    width: '100%',
    height: '100%'
  },
  container: {
    padding: '40px'
  },
  commands: {
    marginTop: '20px'
  },
  activityCountdown: {
    display: 'flex'
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

export const CountDownTimer = TimedComponent(
  ({ timeNow, length, start, children }) => {
    const timeLeft = Math.ceil((length - Math.ceil(timeNow - start)) / 1000);
    return (
      <div>
        {children}
        {timeLeft + ' s'}
      </div>
    );
  },
  100
);

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
