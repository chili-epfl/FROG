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

const styles = {
  card: {},
  radioGroup: {
    marginTop: '40px'
  },
  buy: {
    marginLeft: 'auto'
  }
};

const coordinates = [
  { id: 'geneva', minX: 146, maxX: 166, minY: 598, maxY: 618 },
  { id: 'lausanne', minX: 165, maxX: 185, minY: 614, maxY: 634 },
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
    bike: string
  },
  input: {
    focus: string,
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
      bike: ''
    },
    input: {
      focus: '',
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

    console.log(normX, normY);

    if (this.state.input.switch) {
      const id = findInRange(normX, normY);
      const answer = { ...this.state.answer };
      answer[this.state.input.focus] = id;

      if (id) {
        this.setState({ answer });
      }
      this.setState({ input: { focus: '', switch: false } });
    }
  };

  onFocus = focusedInput => () => {
    this.setState({ input: { focus: focusedInput, switch: true } });
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
            <Grid container>
              <Grid item xs={12} sm={6}>
                <ReactCursorPosition>
                  <SwissMap
                    canSelectCity={this.state.input.switch}
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
                  <Grid item sm={12} className={classes.radioGroup}>
                    <RadioGroupElements
                      answer={this.state.answer}
                      onRadio={this.handleRadio}
                    />
                  </Grid>
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
