// @flow
import * as React from 'react';
import { Panel } from './Panel';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}));

export const Header = () => {
  const classes = useStyle();
  return (
    <Panel>
      <div className={classes.root}>
        <Typography color="primary" variant="caption">
          ORCHESTRATING
        </Typography>
        <Typography variant="body2">FROG Demo Graph</Typography>
      </div>
    </Panel>
  );
};
