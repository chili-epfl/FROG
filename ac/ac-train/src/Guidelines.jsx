// @flow

import * as React from 'react';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';

const styles = {
  guidelines: {
    maxWidth: '600px'
  }
};

export const DragAndDropGuidelines = () => (
  <React.Fragment>
    <Typography variant="title" gutterBottom>
      Drag-and-drop interface.
    </Typography>

    <Typography variant="subheading" gutterBottom>
      In this interface you will choose the different possible elements of the
      ticket (origin, destination, fare, etc.) using the mouse, dragging them
      onto the appropriate box/field (from, to, fare, bike, etc.).
    </Typography>
  </React.Fragment>
);

export const FormGuidelines = () => (
  <React.Fragment>
    <Typography variant="title" gutterBottom>
      Form interface:
    </Typography>

    <Typography variant="subheading" gutterBottom>
      Choose your city, destination, fare and other options from dropdown fields
      in a form.
    </Typography>
  </React.Fragment>
);

export const MapGuidelines = () => (
  <React.Fragment>
    <Typography variant="title" gutterBottom>
      Map interface:
    </Typography>

    <Typography variant="subheading" gutterBottom>
      In this interface you choose origin/destination cities from a map. The
      first chosen city is the one you from which you start the travel and the
      second is the destination. Other options are to be chosen from the form
      under the map.
    </Typography>
  </React.Fragment>
);

export const CommandGuidelines = () => (
  <React.Fragment>
    <Typography variant="title" gutterBottom>
      Command line interface:
    </Typography>

    <Typography variant="subheading" gutterBottom>
      In this interface you write a command in the following format:
    </Typography>
    <pre style={{ color: pink[500], fontWeight: 500 }}>
      {
        'from [city] to [city] { young|half-fare|standard} {bike} {C1|C2} {one-way|return} '
      }
    </pre>
    <Typography variant="subheading" gutterBottom>
      where cities are obligatory. Optional arguments are{' '}
      {'{ young | half-fare | standard }'} stands for fare, {'{ bike }'} for
      ticket with a bike, {'{ one-way | return }'} for the type of travel and{' '}
      {'{ C1|C2 }'} is the first or the second class. Example:
    </Typography>
    <pre style={{ color: pink[500], fontWeight: 500 }}>
      from Zurich to Lausanne young C1 one-way
    </pre>
    <Typography variant="subheading" gutterBottom>
      will order a ticket 1st class one-way from Zurich to Lausanne with a
      discount for young people and without bike.
    </Typography>
  </React.Fragment>
);

export const StartingGuidelines = () => (
  <Grid container spacing={24}>
    <Grid item style={{ width: '100%' }}>
      <Typography variant="display2" gutterBottom>
        Train Activity
      </Typography>
      <Typography variant="subheading" gutterBottom>
        You are about to see{' '}
        <span style={{ color: pink[500], fontWeight: 500 }}>four</span>{' '}
        different kinds of user interfaces for ordering tickets. They will be
        presented in a random order. Your task is to buy the ticket that is
        specified at the top of each page.
      </Typography>
    </Grid>

    <Grid item style={{ width: '100%' }}>
      <CommandGuidelines />
    </Grid>

    <Grid item style={{ width: '100%' }}>
      <MapGuidelines />
    </Grid>

    <Grid item style={{ width: '100%' }}>
      <FormGuidelines />
    </Grid>
    <Grid item style={{ width: '100%' }}>
      <DragAndDropGuidelines />
    </Grid>
    <div style={{ marginTop: '20px' }} />
  </Grid>
);

export const SwitchGuidelines = ({
  whichInterface
}: {
  whichInterface: string
}) => {
  switch (whichInterface) {
    case 'start':
      return <StartingGuidelines />;
    case 'command':
      return <CommandGuidelines />;
    case 'form':
      return <FormGuidelines />;
    case 'dragdrop':
      return <DragAndDropGuidelines />;
    case 'map':
      return <MapGuidelines />;
    default:
      return null;
  }
};

const SpecificGuidelineController = ({
  whichInterface,
  start,
  step,
  classes
}: {
  whichInterface: string,
  start: Function,
  step: number,
  classes: Object
}) => (
  <Grid container justify="center">
    <Grid container className={step > 0 ? classes.guidelines : ''} spacing={24}>
      <Grid item sm={12}>
        <SwitchGuidelines whichInterface={whichInterface} />
      </Grid>
      <Grid item sm={12}>
        <Grid container justify="flex-end">
          <Button color="primary" variant="raised" onClick={start}>
            {step === 0 ? 'Game on!' : 'Start'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export const SpecificGuideline = withStyles(styles)(
  SpecificGuidelineController
);
