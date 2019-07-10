// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { type PropsT } from './types';
import { style } from './style';
import { withModalController } from '../Wiki/components/Modal';
import SignUpModal from '../AccountModal/SignUpModal';

/**
 * Navigation bar displayed at the top
 */
function TopBar(props: PropsT) {
  const { classes, showModal, hideModal } = props;

  const openSignUpModal = () => {
    showModal(<SignUpModal hideModal={hideModal} />);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar classes={{ root: classes.navbar }}>
        <Typography variant="h6" color="inherit" className={classes.logo}>
          FROG
        </Typography>
        <Button size="medium">Help</Button>
        <Button size="medium" onClick={openSignUpModal}>
          Log In/Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
}
const TopBarWithModal = withModalController(TopBar);
export default withStyles(style)(TopBarWithModal);
