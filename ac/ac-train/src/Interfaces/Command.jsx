// @flow

import * as React from 'react';

// UI
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

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

  handleEnter = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit();
    }
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
              onKeyPress={this.handleEnter}
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
