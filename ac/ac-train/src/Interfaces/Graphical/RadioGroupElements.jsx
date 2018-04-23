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

const styles = (theme: Object) => ({
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

const RadioGroupElements = ({
  classes,
  answer,
  onRadio,
  onEnter
}: {
  classes: Object,
  answer: Object,
  onRadio: Function,
  onEnter: Function
}) => (
  <Grid container>
    {radioGroups.map(group => (
      <Grid key={group.id} item xs={6} lg={3}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">
            {capitalizeFirstLetter(group.id)}
          </FormLabel>
          <RadioGroup
            aria-label={group.id}
            name={group.id}
            className={classes.group}
            value={answer[group.id]}
            onChange={onRadio(group.id)}
            onKeyPress={onEnter}
          >
            {group.values.map(item => (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio />}
                label={capitalizeFirstLetter(item)}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
    ))}
  </Grid>
);

export default withStyles(styles)(RadioGroupElements);
