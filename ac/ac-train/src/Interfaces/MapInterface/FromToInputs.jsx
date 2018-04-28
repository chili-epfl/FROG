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

type PropsT = {
  inputState: {
    initial: string,
    focus: string
  },
  classes: Object,
  answer: Object,
  onClickFromTo: Function,
  onEnter: Function
};

class FromToInputs extends React.Component<PropsT> {
  from: HTMLInputElement;
  to: HTMLInputElement;

  handleFocus = () => {
    const { inputState } = this.props;

    if (inputState.initial) {
      if (inputState.focus === 'from') this.from.focus();

      if (inputState.focus === 'to') this.to.focus();
    }
  };

  handleInputRefs = (id: string, ref: HTMLInputElement) => {
    if (id === 'from') this.from = ref;

    if (id === 'to') this.to = ref;
  };

  componentWillReceiveProps() {
    this.handleFocus();
  }

  componentDidMount() {
    this.handleFocus();
  }

  render() {
    const { classes, answer, onClickFromTo, onEnter } = this.props;
    return (
      <Grid container onKeyPress={onEnter}>
        <Grid item sm={6}>
          <FormControl className={classes.formControl} margin="normal">
            <InputLabel htmlFor="from">From</InputLabel>
            <Input
              id="from"
              value={capitalizeFirstLetter(answer.from)}
              onClick={onClickFromTo('from')}
              placeholder="Click on Map"
              inputRef={(input: HTMLInputElement) =>
                this.handleInputRefs('from', input)
              }
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
              inputRef={(input: HTMLInputElement) =>
                this.handleInputRefs('to', input)
              }
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(FromToInputs);
