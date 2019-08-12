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
import {Edit , MoreVert} from '@material-ui/icons';
import { useModal } from '/imports/ui/Modal';
import { type PropsT } from './types';
import { style } from './style';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { getUsername, getUserType } from '/imports/api/users';
import {OverflowMenu} from '/imports/ui/OverflowMenu';
import { PersonalProfileModal } from '../AccountModal/PersonalProfileModal';
import {RowButton} from '/imports/ui/RowItems'; 
import {Button as OverflowButton}  from '/imports/ui/Button'; 

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
  const openPersonalProfileModal = () => {
    showModal(<PersonalProfileModal />);
  };


  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        {getUserType() === 'Anonymous' && (
          <>
            <Button size="medium" onClick={openSignUpModal}>
              Create an account
            </Button>
            <Button size="medium" onClick={openLoginModal}>
              Login
            </Button>
          </>
        )}
        {getUserType() === 'Verified' && (
          <>
            <OverflowMenu button = {<OverflowButton variant = 'minimal' icon = {<MoreVert />}/>}>
            <RowButton onClick = {openPersonalProfileModal} icon = {<Edit fontSize = "small"/>}> View/Edit Profile </RowButton> 
            </OverflowMenu>
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
        {getUserType() === 'Legacy' && (
          <>
            <Button
              size="medium"
              onClick={() => {
                sessionStorage.removeItem('frog.sessionToken');
                Meteor.logout();
                window.location.replace('/');
              }}
            >
              Logout
            </Button>

            <Button size="medium" onClick={openSignUpModal}>
              Upgrade your account
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
