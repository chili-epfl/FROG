// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import { type PropsT } from './types';
import { style } from './style';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { useModal } from '/imports/client/UIComponents/ModalController';

/**
 * Navigation bar displayed at the top
 */

function TopBar(props: PropsT) {
  const [showModal] = useModal();
  const { classes } = props;

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
        {Meteor.user().isAnonymous || !Meteor.user() ? (
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
                Meteor.logout();
                window.location.reload();
              }}
            >
              Logout
            </Button>
            <Chip
              avatar={
                <Avatar>{Meteor.user().profile.displayName.charAt(0)}</Avatar>
              }
              label={Meteor.user().profile.displayName}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default withStyles(style)(TopBar);
