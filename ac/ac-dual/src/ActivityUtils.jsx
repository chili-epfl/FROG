// @flow

import * as React from 'react';
import { TimedComponent, HTML } from 'frog-utils';
import { Button } from 'react-bootstrap';

export const styles = {
  button: { width: '120px', margin: '0 5px' },
  text: { fontSize: 'xx-large' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#bbb',
    position: 'absolute'
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
    'Are the two shapes symmetrical? Click Yes or No to answer.',
    'Do not let the ball fall and break the bricks! Use left and right arrows to move.',
    'Now do both tasks at the same time!',
    'Now do both tasks at the same time!'
  ],
  end: 'Activity completed! Thank you!',
  timeLeft: 'Time left in Task -> '
};

export const Guidelines = ({
  start,
  guidelines
}: {
  start: Function,
  guidelines: string
}) => (
  <React.Fragment>
    <div style={{ ...styles.container, padding: '20px' }}>
      <HTML html={guidelines} />
      <div style={{ marginTop: '20px' }}>
        <Button onClick={start} style={styles.button}>
          {texts.start}
        </Button>
      </div>
    </div>
  </React.Fragment>
);

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
