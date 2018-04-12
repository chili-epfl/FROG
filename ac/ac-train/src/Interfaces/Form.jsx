// @flow
import * as React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Timer from 'material-ui-icons/Timer';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Card, { CardContent, CardActions } from 'material-ui/Card';

import Help from './Help';
import { SwitchGuidelines } from '../Guidelines';

import {
  CITIES,
  CLASS,
  FARES,
  WANTBIKE,
  TRAVELDIRECTION,
  capitalizeFirstLetter
} from '../ActivityUtils';

const ALL = [
  { id: 'from', values: CITIES },
  { id: 'to', values: CITIES },
  { id: 'travel', values: TRAVELDIRECTION },
  { id: 'fare', values: FARES },
  { id: 'class', values: CLASS },
  { id: 'bike', values: WANTBIKE }
];

const styles = {
  card: {
    maxWidth: 800
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  buy: {
    marginLeft: 'auto'
  },
  actions: {
    paddingBottom: '20px'
  }
};

type StateT = {
  from: string,
  to: string,
  class: string,
  fare: string,
  bike: string,
  travel: string
};

type PropsT = {
  ticket: string,
  activity: string,
  ticker: number,
  submit: Function,
  onHelpOpen: Function,
  onHelpClose: Function,
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
    bike: ''
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleSubmit = () => {
    this.props.submit(this.state);
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
            {ALL.map(item => (
              <TextField
                key={item.id}
                select
                label={`${capitalizeFirstLetter(item.id)}:`}
                value={this.state[item.id]}
                className={classes.textField}
                onChange={this.handleChange(item.id)}
                margin="normal"
              >
                {item.values.map(i => (
                  <MenuItem key={i} value={i}>
                    {capitalizeFirstLetter(i)}
                  </MenuItem>
                ))}
              </TextField>
            ))}
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

export default withStyles(styles)(Form);
