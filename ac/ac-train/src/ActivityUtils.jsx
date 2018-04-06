// @flow

import * as React from 'react';
import { TimedComponent, HTML } from 'frog-utils';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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

const DragAndDropGuidelines = () => (
  <React.Fragment>
    <Typography variant="headline" gutterBottom>
      Drag-and-drop interface.
    </Typography>

    <Typography gutterBottom>
      Choose your city, destination, fare and other options from dropdown fields
      in a form.
    </Typography>
  </React.Fragment>
);

const FormGuidelines = () => (
  <React.Fragment>
    <Typography variant="headline" gutterBottom>
      Form interface:
    </Typography>

    <Typography gutterBottom>
      In this interface you will choose the different possible elements of the
      ticket (origin, destination, fare, etc.) using the mouse, dragging them
      onto the appropriate box/field (from, to, fare, bike, etc.).
    </Typography>
  </React.Fragment>
);

const GraphGuidelines = () => (
  <React.Fragment>
    <Typography variant="headline" gutterBottom>
      Graphical interface:
    </Typography>

    <Typography gutterBottom>
      In this interface you choose origin/destination cities from a map. The
      first chosen city is the one you from which you start the travel and the
      second is the destination. Other options are to be chosen from the form
      under the map.
    </Typography>
  </React.Fragment>
);

export const CliGuidelines = () => (
  <React.Fragment>
    <Typography variant="headline" gutterBottom>
      Command line interface:
    </Typography>

    <Typography gutterBottom>
      In this interface you write a command in the following format:
    </Typography>
    <pre>
      from [city] to [city]{' '}
      {'{ young|half-fare|standard} {bike} {one-way|return} {C1|C2}'}
    </pre>
    <Typography gutterBottom>
      where cities are obligatory. Optional arguments are{' '}
      {'{ young | half-fare | standard }'} stands for fare, {'{ bike }'} for
      ticket with a bike, {'{ one-way | return }'} for the type of travel and{' '}
      {'{ C1|C2 }'} is the first or the second class. Example:
    </Typography>
    <pre>from Zurich to Lausanne young C1 one-way</pre>
    <Typography gutterBottom>
      will order a ticket 1st class one-way from Zurich to Lausanne with a
      discount for young people and without bike.
    </Typography>
  </React.Fragment>
);

const StartingGuidlines = () => (
  <React.Fragment>
    <Typography variant="display2" gutterBottom>
      Train Activity
    </Typography>
    <Typography gutterBottom>
      You are about to see four different kinds of user interfaces for ordering
      tickets. They will be presented in a random order. Your task is to order a
      ticket, requested on the bottom of each page. Please note that options
      one-way, standard fare, 2nd class and no bike are default in each
      interface.
    </Typography>
  </React.Fragment>
);

export const Guidelines = ({
  beginActivity,
  step
}: {
  beginActivity: Function,
  step: Number
}) => (
  <React.Fragment>
    {step === 0 && <StartingGuidlines />}
    {(step === 0 || step === 1) && <CliGuidelines />}
    {(step === 0 || step === 2) && <GraphGuidelines />}
    {(step === 0 || step === 3) && <FormGuidelines />}
    {(step === 0 || step === 4) && <DragAndDropGuidelines />}

    <div style={{ marginTop: '20px' }}>
      <Button color="primary" onClick={beginActivity}>
        Start
      </Button>
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
