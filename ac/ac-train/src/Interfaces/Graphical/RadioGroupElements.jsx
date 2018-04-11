// @flow
import React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import {
  FARES,
  CLASS,
  TRAVELDIRECTION,
  WANTBIKE,
  capitalizeFirstLetter
} from '../../ActivityUtils';

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

const radioGroups = [
  { id: 'travel', values: TRAVELDIRECTION },
  { id: 'fare', values: FARES },
  { id: 'class', values: CLASS },
  { id: 'bike', values: WANTBIKE }
];

const RadioGroupElements = ({ classes, answer, onRadio }) => (
  <Grid container>
    {radioGroups.map(group => (
      <Grid key={group.id} item sm={3}>
        <FormControl
          component="fieldset"
          required
          className={classes.formControl}
        >
          <FormLabel component="legend">{group.id}</FormLabel>
          <RadioGroup
            aria-label={group.id}
            name={group.id}
            className={classes.group}
            value={answer[group.id]}
            onChange={onRadio(group.id)}
          >
            {group.values.map(item => (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio />}
                label={item}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
    ))}
  </Grid>
);

export default withStyles(styles)(RadioGroupElements);
