import React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import green from 'material-ui/colors/green';

const styles = {
  root: {
    marginTop: '200px',
    height: '125px'
  },
  successText: {
    color: 'green'
  },
  failureText: {
    color: 'red'
  },
  success: {
    backgroundColor: green[500],
    color: 'white'
  },
  failure: {
    backgroundColor: '#cb2431',
    color: 'white'
  },
  center: {
    textAlign: 'center'
  }
};

const validationText = {
  success: 'Your ticket was successfully purchased!',
  failure:
    '"Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better." - Samuel Beckett'
};

type IntervalPropsT = {
  classes: Object,
  nextInstance: Function
};

const Transition = ({ classes }) => (
  <React.Fragment>
    <Grid item xs={12} className={classes.center}>
      <CircularProgress size={50} />
    </Grid>
    <Grid>
      <Typography align="center">Checking status of your ticket...</Typography>
    </Grid>
  </React.Fragment>
);

const ValidationStatus = ({ checkAnswer, classes }) => (
  <React.Fragment>
    <Grid item xs={12} className={classes.center}>
      <Button
        variant="fab"
        className={checkAnswer ? classes.success : classes.failure}
      >
        {checkAnswer ? <Check /> : <Clear />}
      </Button>
    </Grid>
    <Grid>
      <Typography
        align="center"
        className={checkAnswer ? classes.successText : classes.failureText}
      >
        {checkAnswer ? validationText['success'] : validationText['failure']}
      </Typography>
    </Grid>
  </React.Fragment>
);

class Validation extends React.Component<IntervalPropsT> {
  interval: TimeoutID;

  constructor(props) {
    super(props);
    this.state = { checkAnswer: this.props.checkAnswer, transition: true };
  }

  startTimer = () => {
    this.interval = setTimeout(() => {
      if (this.state.transition) {
        this.setState({ transition: false });
        this.stopTimer();
        this.startTimer();
      } else {
        this.props.nextInstance();
      }
    }, this.state.transition ? 1000 : 2000);
  };

  stopTimer = () => {
    clearTimeout(this.interval);
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const { classes, checkAnswer } = this.props;
    const { transition } = this.state;

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        {transition ? (
          <Transition classes={classes} />
        ) : (
          <ValidationStatus classes={classes} checkAnswer={checkAnswer} />
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(Validation);
