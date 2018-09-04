// @flow

import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const styles = () => ({
  container: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4px',
    margin: '4px'
  },
  button: {
    margin: '4px',
    padding: '6px',
    justifyContent: 'baseline'
  }
});

const transfo = ['log', 'exp', 'outliers', 'sqrt', 'x100', '+50', '11x-10E[x]'];

const disabledFun = (data, tr) => {
  if (!data.values) return true;
  switch (tr) {
    case 'log':
      return data.values.reduce(
        (acc, cur) => acc || Number.isNaN(Math.log(cur[0])),
        false
      );
    case 'sqrt':
      return data.values.reduce(
        (acc, cur) => acc || Number.isNaN(Math.sqrt(cur[0])),
        false
      );
    default:
      return false;
  }
};

export default withStyles(styles)(
  ({
    setTransformation,
    transformation,
    data,
    logger,
    dataset,
    classes
  }: Object) => (
    <Paper className={classes.container}>
      {transfo.map(tr => (
        <Button
          className={classes.button}
          disabled={disabledFun(data, tr)}
          variant="contained"
          key={tr}
          onClick={() => {
            setTransformation(transformation !== tr ? tr : '');
            logger({
              type: 'set transformation',
              itemId: dataset,
              value: transformation !== tr ? tr : ''
            });
          }}
          style={{ backgroundColor: transformation === tr ? '#ccc' : '#fff' }}
        >
          {tr}
        </Button>
      ))}
    </Paper>
  )
);
