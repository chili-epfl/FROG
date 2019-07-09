// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { type PropsT } from './types';
import { style } from './style';

const openSignUpModal = () => {
  this.props.showModal(
    )
}

/**
 * Navigation bar displayed at the top
 */
function TopBar(props: PropsT) {
  const { classes } = props;
  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        <Button size="medium">Help</Button>
        <Button size="medium" onClick>Log In/Sign Up</Button>
      </Toolbar>
    </AppBar>
  );
}
export default withStyles(style)(TopBar);
