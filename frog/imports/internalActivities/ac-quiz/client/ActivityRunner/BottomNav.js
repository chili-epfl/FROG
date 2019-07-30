// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
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
  canSubmit,
  classes
}) => {
  const showPrevious = showOne && index > 0;
  const showNext = showOne && hasNext;
  const showSubmit = !showOne || !hasNext;
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
          disabled={!hasAnswered && !allowSkip}
        >
          Next
        </Button>
      )}
      {showSubmit && (
        <Button
          variant="contained"
          color="primary"
          disabled={!canSubmit}
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
