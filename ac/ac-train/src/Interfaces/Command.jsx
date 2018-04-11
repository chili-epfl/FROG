// @flow

import * as React from 'react';

// UI
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

import Help from './Help';
import { CommandGuidelines } from '../Guidelines';

type State = {
  text: string
};

type Props = {
  ticket: string,
  submit: Function,
  helpOpen: Function,
  helpClose: Function,
  help: boolean
};

class Command extends React.Component<Props, State> {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = () => {
    this.props.submit();
  };

  render() {
    const { ticket, helpOpen, helpClose, help } = this.props;

    return (
      <Grid container>
        <Grid item sm={12}>
          <Typography gutterBottom>{ticket}</Typography>
        </Grid>
        <Grid item sm={6}>
          <TextField
            id="multiline-flexible"
            label="Enter command"
            value={this.state.text}
            onChange={this.handleChange}
            multiline
            rowsMax="4"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item sm={3}>
          <Button color="primary" onClick={this.handleSubmit}>
            Buy
          </Button>
        </Grid>
        <Grid item sm={3}>
          <Help onOpen={helpOpen} onClose={helpClose} open={help}>
            <CommandGuidelines />
          </Help>
        </Grid>
      </Grid>
    );
  }
}

export default Command;
