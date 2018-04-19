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

class FromToInputs extends React.Component {
  handleFocus = () => {
    const { inputState } = this.props;

    if (inputState.initial) {
      this[inputState.focus].focus();
    }
  };

  handleInputRefs = (id, ref) => {
    this[id] = ref;
  };

  componentWillReceiveProps() {
    this.handleFocus();
  }

  componentDidMount() {
    this.handleFocus();
  }

  render() {
    const { classes, answer } = this.props;
    return (
      <Grid container>
        <Grid item sm={6}>
          <FormControl className={classes.formControl} margin="normal">
            <InputLabel htmlFor="from">From</InputLabel>
            <Input
              id="from"
              value={capitalizeFirstLetter(answer.from)}
              onClick={this.props.onClickFromTo('from')}
              placeholder="Click on Map"
              inputRef={input => this.handleInputRefs('from', input)}
            />
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <FormControl className={classes.formControl} margin="normal">
            <InputLabel htmlFor="to">To</InputLabel>
            <Input
              id="to"
              value={capitalizeFirstLetter(answer.to)}
              onClick={this.props.onClickFromTo('to')}
              placeholder="Click on Map"
              inputRef={input => this.handleInputRefs('to', input)}
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(FromToInputs);
