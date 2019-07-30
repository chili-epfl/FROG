// @flow
import * as React from 'react';
import { Panel } from './Panel';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '200px',
    padding: theme.spacing(0, 1, 1, 1)
  },
  inside: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export const SampleContent = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.inside}>
        <Typography variant="body2">Content goes here</Typography>
      </div>
    </div>
  );
};
