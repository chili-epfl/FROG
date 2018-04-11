// @flow
import * as React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import Button from 'material-ui/Button';

import Help from './Help';
import { FormGuidelines } from '../Guidelines';
import {
  CITIES,
  CLASS,
  FARES,
  WANTBIKE,
  TRAVELDIRECTION
} from '../ActivityUtils';

const styles = theme => ({
  root: {},
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    padding: '100px'
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  }
});

type StateT = {
  from: string,
  to: string,
  class: string,
  fare: string,
  bike: string
};

type PropsT = {
  ticket: string,
  submit: Function,
  helpOpen: Function,
  helpClose: Function,
  help: boolean,
  classes: Object
};

class Form extends React.Component<PropsT, StateT> {
  state = {
    from: '',
    to: '',
    travel: '',
    class: '',
    fare: '',
    bike: 'No'
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleSubmit = () => {
    console.log('HandleSubmit of Form called');

    this.props.submit();
  };

  render() {
    const { ticket, helpOpen, helpClose, help, classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography gutterBottom>{ticket}</Typography>
        <div className={classes.formControls}>
          <TextField
            select
            label="From:"
            value={this.state.from}
            className={classes.textField}
            onChange={this.handleChange('from')}
          >
            {CITIES.map(city => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="To:"
            value={this.state.to}
            className={classes.textField}
            onChange={this.handleChange('to')}
          >
            {CITIES.map(city => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Class:"
            value={this.state.class}
            onChange={this.handleChange('class')}
          >
            {CLASS.map((c, index) => (
              <MenuItem key={c} value={index}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Fares:"
            value={this.state.fare}
            onChange={this.handleChange('fare')}
          >
            {FARES.map(fare => (
              <MenuItem key={fare} value={fare}>
                {fare}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Travel:"
            value={this.state.travel}
            onChange={this.handleChange('travel')}
          >
            {TRAVELDIRECTION.map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Bike:"
            value={this.state.bike}
            onChange={this.handleChange('bike')}
          >
            {WANTBIKE.map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button color="primary" onClick={this.handleSubmit}>
          Buy
        </Button>
        <Help onOpen={helpOpen} onClose={helpClose} open={help}>
          <FormGuidelines />
        </Help>
      </div>
    );
  }
}

export default withStyles(styles)(Form);
