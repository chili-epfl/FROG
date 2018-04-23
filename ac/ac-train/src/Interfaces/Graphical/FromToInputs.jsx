// @flow
import React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import { capitalizeFirstLetter } from '../../ActivityUtils';

const styles = theme => ({
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    padding: '100px'
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

const FromToInputs = ({
  classes,
  answer,
  onClickFromTo,
  onEnter
}: {
  classes: Object,
  answer: Object,
  onClickFromTo: Function,
  onEnter: Function
}) => (
  <Grid container onKeyPress={onEnter}>
    <Grid item sm={6}>
      <FormControl className={classes.formControl} margin="normal">
        <InputLabel htmlFor="from">From</InputLabel>
        <Input
          id="from"
          value={capitalizeFirstLetter(answer.from)}
          onClick={onClickFromTo('from')}
          autoFocus
          placeholder="Click on Map"
        />
      </FormControl>
    </Grid>
    <Grid item sm={6}>
      <FormControl className={classes.formControl} margin="normal">
        <InputLabel htmlFor="to">To</InputLabel>
        <Input
          id="to"
          value={capitalizeFirstLetter(answer.to)}
          onClick={onClickFromTo('to')}
          placeholder="Click on Map"
        />
      </FormControl>
    </Grid>
  </Grid>
);

export default withStyles(styles)(FromToInputs);
