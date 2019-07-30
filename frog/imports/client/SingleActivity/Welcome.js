// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { type PropsT } from './types';
import { style } from './style';

/**
 * Introductory welcome message shown to users at the beginning
 */
function Welcome(props: PropsT) {
  const { classes } = props;
  return (
    <Card raised className={classes.welcome_card}>
      <Typography variant="h3" component="h2">
        Welcome to FROG!
      </Typography>
      <Typography variant="h4" component="h3">
        FROG is a tool to improve the way you present your lecture You can use
        these activities to make your classroom interactive while having a full
        control over the progress of the class and all it takes is 3 steps!
      </Typography>
    </Card>
  );
}
export default withStyles(style)(Welcome);
