import * as React from 'react';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import SettingsModel from './SettingsModal';
import styles from './styles';

import {
  ControlButton,
  SessionUtilsButtonsModel
} from './Utils/buttonUtils.js';

class UtilsMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { buttonsModel } = this.props;

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          color="primary"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              this.handleClose();
              buttonsModel.export.button.onClick();
            }}
          >
            {buttonsModel.export.text}
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleClose();
              buttonsModel.download.button.onClick();
            }}
          >
            {buttonsModel.download.text}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const SessionUtils = ({ classes, session }) => {
  const buttonsModel = SessionUtilsButtonsModel(session);

  return (
    <div className={classes.root}>
      <Grid
        container
        className={classes.root}
        justify="space-between"
        alignItems="center"
        containerspacing={0}
      >
        <Grid item xs={4} className={classes.zero} />
        <Grid item xs={4} style={{ textAlign: 'center' }}>
          <ControlButton btnModel={buttonsModel.current} classes={classes}>
            Current Session: {session.slug}
          </ControlButton>
        </Grid>
        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={6} style={{ textAlign: 'center' }}>
              <SettingsModel session={session} />
              {/* <SettingsModel
                session={session}
                dismiss={() => console.log('1')}
              /> */}
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              <UtilsMenu buttonsModel={buttonsModel} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(SessionUtils);
