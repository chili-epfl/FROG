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
  success: 'Correct ticket purchased!',
  failure: 'Wrong ticket purchased :('
};

type IntervalPropsT = {
  classes: Object,
  nextIteration: Function
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

const ValidationStatus = ({ isCorrect, classes }) => (
  <React.Fragment>
    <Grid item xs={12} className={classes.center}>
      <Button
        variant="fab"
        className={isCorrect ? classes.success : classes.failure}
      >
        {isCorrect ? <Check /> : <Clear />}
      </Button>
    </Grid>
    <Grid>
      <Typography
        align="center"
        className={isCorrect ? classes.successText : classes.failureText}
      >
        {isCorrect ? validationText['success'] : validationText['failure']}
      </Typography>
    </Grid>
  </React.Fragment>
);

class TicketStatus extends React.Component<IntervalPropsT> {
  timer: TimeoutID;

  constructor(props) {
    super(props);
    this.state = { isCorrect: this.props.isCorrect, transition: true };
  }

  startTimer = () => {
    const { timeToDisplay } = this.props;

    this.timer = setTimeout(() => {
      if (this.state.transition) {
        this.setState({ transition: false });
        this.stopTimer();
        this.startTimer();
      } else {
        this.props.nextIteration();
      }
    }, this.state.transition ? timeToDisplay / 2 : timeToDisplay);
  };

  stopTimer = () => {
    clearTimeout(this.timer);
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  render() {
    const { classes, isCorrect } = this.props;
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
          <ValidationStatus classes={classes} isCorrect={isCorrect} />
        )}
      </Grid>
    );
  }
}

export default withStyles(styles)(TicketStatus);
