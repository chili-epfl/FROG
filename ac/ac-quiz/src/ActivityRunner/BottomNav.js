// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = () => ({
  buttonRight: {
    float: 'right'
  },
  buttonContainer: {
    marginTop: '20px'
  }
});

const BottomNav = ({
  index,
  setIndex,
  onSubmit,
  hasNext,
  hasAnswered,
  allowSkip,
  showOne,
  classes
}) => {
  const showPrevious = showOne && index > 0;
  const showNext = showOne && hasNext && (hasAnswered || allowSkip);
  const showSubmit = !showOne || (!hasNext && (hasAnswered || allowSkip));
  return (
    <div className={classes.buttonContainer}>
      {showPrevious && (
        <Button variant="contained" onClick={() => setIndex(index - 1)}>
          Previous
        </Button>
      )}
      {showNext && (
        <Button
          variant="contained"
          onClick={() => setIndex(index + 1)}
          className={classes.buttonRight}
        >
          Next
        </Button>
      )}
      {showSubmit && (
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          className={classes.buttonRight}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default withStyles(styles)(BottomNav);
