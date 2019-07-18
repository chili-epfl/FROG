// @flow

import * as React from 'react';
import { TimedComponent, HTML } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const styles = {
  button: {
    width: '200px',
    margin: '0 5px',
    backgroundColor: '#DFDFDF'
  },
  text: { fontSize: 'large' },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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

const GuidelinesWS = ({
  start,
  guidelines,
  classes
}: {
  start: Function,
  guidelines: string,
  classes: Object
}) => (
  <React.Fragment>
    <div style={{ ...styles.container, padding: '20px' }}>
      <HTML html={guidelines} />
      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={start}
          variant="outlined"
          classes={{ root: classes.button }}
        >
          {texts.start}
        </Button>
      </div>
    </div>
  </React.Fragment>
);

export const Guidelines = withStyles(styles)(GuidelinesWS);

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
