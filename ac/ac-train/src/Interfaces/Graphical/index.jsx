// @flow
import React from 'react';
import ReactCursorPosition from 'react-cursor-position';

// UI
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Card, { CardContent, CardActions } from 'material-ui/Card';

// Interal Imports
import RadioGroupElements from './RadioGroupElements';
import FromToInputs from './FromToInputs';
import SwissMap from './SwissMap';
import Actions from '../Actions';

const styles = {
  card: {},
  radioGroup: {
    marginTop: '40px'
  },
  actions: {
    paddingBottom: '20px'
  },
  buy: {
    marginLeft: 'auto'
  }
};

const coordinates = [
  { id: 'geneva', minX: 65, maxX: 95, minY: 770, maxY: 800 },
  { id: 'lausanne', minX: 165, maxX: 185, minY: 614, maxY: 634 },
  { id: 'fribourg', minX: 265, maxX: 295, minY: 475, maxY: 505 },
  { id: 'basel', minX: 360, maxX: 390, minY: 115, maxY: 145 },
  { id: 'neuchatel', minX: 225, maxX: 255, minY: 375, maxY: 405 },
  { id: 'zurich', minX: 555, maxX: 585, minY: 205, maxY: 235 },
  { id: 'davos', minX: 810, maxX: 840, minY: 470, maxY: 500 }
];

const findInRange = (x, y) => {
  // console.log(x, y);
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
    clickOnCity: boolean
  }
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
      focus: 'from',
      clickOnCity: true,
      initial: true
    }
  };

  handleRadio = (name: string) => event => {
    const answer = { ...this.state.answer };
    answer[name] = event.target.value;
    this.setState({ answer });
  };

  handleClickCity = (position: Object, dimension: Object) => () => {
    const { x, y } = position;
    const { width, height } = dimension;
    const { input } = this.state;

    const normX = Math.round(x / width * 1000);
    const normY = Math.round(y / height * 1000);

    if (input.clickOnCity) {
      const id = findInRange(normX, normY);

      if (id) {
        const answer = { ...this.state.answer };
        answer[input.focus] = id;

        let nextInputState;

        if (input.initial && input.focus === 'from') {
          nextInputState = { focus: 'to', clickOnCity: true, initial: true };
        } else {
          nextInputState = { focus: '', clickOnCity: false, initial: false };
        }

        this.setState({ answer, input: nextInputState });
      }
    }
  };

  handleClickFromTo = (focusedInput: string) => () => {
    this.setState({
      input: { focus: focusedInput, clickOnCity: true, initial: false }
    });
  };

  handleSubmit = () => {
    this.props.submit(this.state.answer);
  };

  handleEnter = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSubmit();
    }
  };

  render() {
    const { ticket, classes, ...actionProps } = this.props;
    const { answer, input } = this.state;

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
            <Grid container spacing={16}>
              <Grid item xs={12} md={8} lg={6}>
                <ReactCursorPosition>
                  <SwissMap
                    canSelectCity={input.clickOnCity}
                    onClickCity={this.handleClickCity}
                  />
                </ReactCursorPosition>
              </Grid>
              <Grid item xs={12} md={4} lg={6}>
                <Grid container>
                  <Grid item sm={12}>
                    <FromToInputs
                      inputState={input}
                      answer={answer}
                      onEnter={this.handleEnter}
                      onClickFromTo={this.handleClickFromTo}
                    />
                  </Grid>
                  <Grid item sm={12} className={classes.radioGroup}>
                    <RadioGroupElements
                      answer={answer}
                      onRadio={this.handleRadio}
                      onEnter={this.handleEnter}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Actions submitAnswer={this.handleSubmit} {...actionProps} />
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Graphical);
