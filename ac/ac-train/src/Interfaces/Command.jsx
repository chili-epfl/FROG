// @flow

import * as React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import ShoppingCart from 'material-ui/icons/ShoppingCart';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from 'material-ui/Card';

import Help from './Help';
import { SwitchGuidelines } from '../Guidelines';

const styles = {
  card: {
    maxWidth: 800
  },
  buy: {
    marginLeft: 'auto'
  }
};

type State = {
  text: string
};

type Props = {
  ticket: string,
  submit: Function,
  onHelpOpen: Function,
  onHelpClose: Function,
  help: boolean,
  classes: Object,
  activity: string
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
    const {
      ticket,
      activity,
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
          <CardContent>
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
            <Help onOpen={onHelpOpen} onClose={onHelpClose} open={help}>
              <SwitchGuidelines activity={activity} />
            </Help>
            <Button
              color="primary"
              variant="fab"
              className={classes.buy}
              onClick={this.handleSubmit}
            >
              <ShoppingCart />
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Command);
