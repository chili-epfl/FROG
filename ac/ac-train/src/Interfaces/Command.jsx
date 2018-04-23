// @flow

import * as React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Card, { CardContent, CardActions } from 'material-ui/Card';

import Actions from './Actions';
import { commandDataStructure } from '../ActivityUtils';

const styles = {
  card: {
    maxWidth: 800
  },
  buy: {
    marginLeft: 'auto'
  },
  content: {
    height: '200px'
  },
  actions: {
    paddingBottom: '20px'
  }
};

type StateT = {
  text: string
};

type PropsT = {
  ticket: string,
  submit: Function,
  onHelpOpen: Function,
  onHelpClose: Function,
  help: boolean,
  classes: Object,
  whichInterface: string,
  ticker: string
};

class Command extends React.Component<PropsT, StateT> {
  state = {
    text: ''
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  handleSubmit = () => {
    this.props.submit(commandDataStructure(this.state.text));
  };

  render() {
    const { ticket, classes, ...actionProps } = this.props;

    return (
      <Grid container justify="center">
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" color="secondary" gutterBottom>
              Question
            </Typography>
            <Typography variant="subheading" gutterBottom>
              {ticket}
            </Typography>
          </CardContent>
          <Divider />
          <CardContent className={classes.content}>
            <TextField
              id="multiline-flexible"
              label="Enter command"
              value={this.state.text}
              onChange={this.handleChange}
              autoFocus
              fullWidth
              margin="normal"
            />
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Actions submitAnswer={this.handleSubmit} {...actionProps} />
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Command);
