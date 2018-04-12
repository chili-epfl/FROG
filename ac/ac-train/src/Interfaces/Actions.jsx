import React from 'react';

// UI
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Timer from 'material-ui-icons/Timer';
import ShoppingCart from 'material-ui-icons/ShoppingCart';
import Button from 'material-ui/Button';

import Help from './Help';
import { SwitchGuidelines } from '../Guidelines';

const styles = {
  card: {
    maxWidth: 800
  },
  buttons: {
    marginLeft: 'auto'
  },
  buy: {
    marginLeft: '20px'
  },
  ticker: {
    fontSize: '1.2rem',
    paddingLeft: '2px'
  },
  tickerButton: {
    cursor: 'default'
  }
};

const Actions = ({
  ticker,
  activity,
  onHelpOpen,
  onHelpClose,
  help,
  classes,
  submitAnswer
}) => (
  <React.Fragment>
    <IconButton className={classes.tickerButton}>
      <Timer />
      <span className={classes.ticker}>:{ticker}</span>
    </IconButton>
    <div className={classes.buttons}>
      <Help onOpen={onHelpOpen} onClose={onHelpClose} open={help}>
        <SwitchGuidelines activity={activity} />
      </Help>
      <Button
        color="primary"
        variant="fab"
        className={classes.buy}
        onClick={submitAnswer}
      >
        <ShoppingCart />
      </Button>
    </div>
  </React.Fragment>
);

export default withStyles(styles)(Actions);
