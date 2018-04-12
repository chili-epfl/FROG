// @flow

import * as React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Timer from 'material-ui-icons/Timer';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Card, { CardContent, CardActions } from 'material-ui/Card';

import Help from './Help';
import { SwitchGuidelines } from '../Guidelines';
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
  activity: string,
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
    const {
      ticket,
      activity,
      ticker,
      help,
      onHelpOpen,
      onHelpClose,
      classes
    } = this.props;

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
              multiline
              rowsMax="4"
              fullWidth
              margin="normal"
            />
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton disabled>
              <Timer />
              :{ticker}
            </IconButton>
            <Help onOpen={onHelpOpen} onClose={onHelpClose} open={help}>
              <SwitchGuidelines activity={activity} />
            </Help>
            <IconButton
              color="primary"
              className={classes.buy}
              onClick={this.handleSubmit}
            >
              <ShoppingCart />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Command);
