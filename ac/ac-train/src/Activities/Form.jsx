import React from 'react';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import { cities, travelClass, fares, bike } from '../ActivityUtils';

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

class Form extends React.Component {
  state = {
    from: '------',
    to: '-------',
    travel: '------',
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
    const { ticket, classes } = this.props;

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
            {cities.map(city => (
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
            {cities.map(city => (
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
            {travelClass.map(c => (
              <MenuItem key={c} value={c}>
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
            {fares.map(fare => (
              <MenuItem key={fare} value={fare}>
                {fare}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Bike:"
            value={this.state.bike}
            onChange={this.handleChange('bike')}
          >
            {bike.map(b => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Button color="primary" onClick={this.handleSubmit}>
          Buy
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Form);
