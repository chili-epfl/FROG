// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import {
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';
import { useModal } from '/imports/ui/Modal';
import { type PropsT } from './types';
import { style } from './style';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { getUsername } from '/imports/api/users';
/**
 * Navigation bar displayed at the top
 */

function TopBar(props: PropsT) {
  const [showModal] = useModal();
  const { classes } = props;
  const user = Meteor.user();

  const openSignUpModal = () => {
    showModal(<AccountModal formToDisplay="signup" />);
  };

  const openLoginModal = () => {
    showModal(<AccountModal formToDisplay="login" />);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        {user.isAnonymous || !user ? (
          <>
            <Button size="medium" onClick={openSignUpModal}>
              Create a verified account
            </Button>
            <Button size="medium" onClick={openLoginModal}>
              Login
            </Button>
          </>
        ) : (
          <>
            <Button
              size="medium"
              onClick={() => {
                sessionStorage.removeItem('frog.sessionToken');
                Meteor.logout(() => window.location.replace('/'));
              }}
            >
              Logout
            </Button>
            <Chip
              avatar={<Avatar>{getUsername().charAt(0)}</Avatar>}
              label={getUsername()}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default withStyles(style)(TopBar);
