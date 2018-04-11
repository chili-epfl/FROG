// @flow
import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

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

// Interal Imports
import RadioGroupElements from './RadioGroupElements';
import FromToInputs from './FromToInputs';
import SwissMap from './SwissMap';
import Help from '../Help';
import { SwitchGuidelines } from '../../Guidelines';

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
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  },

  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

const coordinates = [
  { id: 'geneva', minX: 46, maxX: 56, minY: 755, maxY: 765 },
  { id: 'lausanne', minX: 146, maxX: 166, minY: 598, maxY: 618 },
  { id: 'fribourg', minX: 255, maxX: 275, minY: 480, maxY: 500 },
  { id: 'basel', minX: 350, maxX: 370, minY: 134, maxY: 154 },
  { id: 'neuchatel', minX: 205, maxX: 225, minY: 390, maxY: 410 }
];

type StateT = {
  answer: {
    from: string,
    to: string,
    travel: string,
    class: string,
    fare: string,
    bike: false
  },
  input: {
    which: string,
    switch: boolean
  }
};

type PropsT = {
  ticket: string,
  submit: Function,
  helpOpen: Function,
  helpClose: Function,
  help: boolean,
  classes: Object
};

const findInRange = (x, y) => {
  console.log(x, y);
  for (let i = 0; i < coordinates.length; i += 1) {
    const index = coordinates[i];

    if (
      x >= index.minX &&
      x <= index.maxX &&
      y >= index.minY &&
      y <= index.maxY
    ) {
      return index.id;
    }
  }

  return false;
};

class Graphical extends React.Component<PropsT, StateT> {
  state = {
    answer: {
      from: '',
      to: '',
      travel: '',
      class: '',
      fare: '',
      bike: false
    },
    input: {
      which: '',
      switch: false
    }
  };

  handleRadio = name => event => {
    const answer = { ...this.state.answer };
    answer[name] = event.target.value;
    this.setState({ answer });
  };

  handleClickCity = (position, dimension) => () => {
    const { x, y } = position;
    const { width, height } = dimension;

    const normX = Math.round(x / width * 1000);
    const normY = Math.round(y / height * 1000);

    if (this.state.input.switch) {
      const id = findInRange(normX, normY);
      const answer = { ...this.state.answer };
      answer.input.which = id;

      if (id) {
        this.setState({ answer });
      }
      this.setState({ input: { which: '', switch: false } });
    }
  };

  onFocus = focusedInput => () => {
    this.setState({ input: { which: focusedInput, switch: true } });
  };

  handleSubmit = () => {
    this.props.submit(this.state.answer);
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
      <Grid container>
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
            <Grid item xs={12} sm={6}>
              <ReactCursorPosition>
                <SwissMap
                  classes={classes}
                  canSelectCity={this.state.input}
                  onClickCity={this.handleClickCity}
                />
              </ReactCursorPosition>
            </Grid>
            <Grid item sm={6}>
              <Grid container>
                <Grid item sm={12}>
                  <FromToInputs
                    answer={this.state.answer}
                    onFocus={this.onFocus}
                  />
                </Grid>
                <Grid item sm={12}>
                  <RadioGroupElements
                    answer={this.state.answer}
                    onRadio={this.handleRadio}
                  />
                </Grid>
              </Grid>
            </Grid>
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

export default withStyles(styles)(Graphical);
