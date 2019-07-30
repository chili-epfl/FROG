// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { type PropsT } from './types';
import { style } from './style';

/**
 * Intermediate loading bar displayed while creating the single activity
 */
function Loading(props: PropsT) {
  const { classes } = props;
  return (
    <Card className={classes.card}>
      <LinearProgress />
      {/* Waiting message to be shown during the time taken to create a graph */}
      <Typography variant="h3" component="h2">
        Abra kadabra!
      </Typography>
      <Typography variant="h4" component="h3">
        You can use the FROG's orchestration graph for creating magic after
        magic after magic!
      </Typography>
    </Card>
  );
}

export default withStyles(style)(Loading);
