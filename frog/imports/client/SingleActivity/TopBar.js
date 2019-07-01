// @flow

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { type PropsT } from './types';

/**
 * Navigation bar displayed at the top
 */
export default function TopBar(props: PropsT) {
  const { classes } = props;
  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        <Button size="medium">Help</Button>
        <Button size="medium">Log In/Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
}
