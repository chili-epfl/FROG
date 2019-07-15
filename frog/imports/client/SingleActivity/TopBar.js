// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import {withRouter} from 'react-router'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Meteor } from 'meteor/meteor';
import Chip from '@material-ui/core/Chip';
import { type PropsT } from './types';
import { style } from './style';
import { withModalController } from '../Wiki/components/Modal';
import SignUpModal from '../AccountModal/SignUpModal';
import LoginModal from '../AccountModal/LoginModal';

/**
 * Navigation bar displayed at the top
 */
function TopBar(props: PropsT) {
  const { classes, showModal, hideModal } = props;

  const openSignUpModal = () => {
    showModal(<SignUpModal hideModal={hideModal} />);
  };
  const openLoginModal = () => {
    showModal(<LoginModal hideModal={hideModal} />);
  };
  const renderButtons = () => {
  let loginButton, signUpButton,logOutButton; 

  if (Meteor.user().isAnonymous)
          {
          
          return (
          <React.Fragment> 
            <Button size = "medium" onClick = {openLoginModal}>
          Login to another account </Button> 
            <Button size="medium" onClick={openSignUpModal}>
             Upgrade your account
           </Button>
        
          </React.Fragment>
          );
        }
        
         else if (!Meteor.user().isAnonymous){
         return  (
            <React.Fragment>

              <Button size="medium" onClick={() => Meteor.logout(() => {
                this.props.history.push('/');
                window.notReady();
              })}>
                Logout 
            </Button>
             <Button size="medium" onClick={openSignUpModal}>
             Create a new account
            </Button>
            <Chip label= {Meteor.user().profile.displayName} className={classes.chip} />
          
            </React.Fragment>

            );
        }

        }

  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        <Button size="medium">Help</Button>
        {renderButtons()}
       
      </Toolbar>
    </AppBar>
  );
}

const TopBarWithModal = withRouter(withModalController(TopBar));
export default withStyles(style)(TopBarWithModal);
