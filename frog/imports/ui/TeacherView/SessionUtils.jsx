import * as React from 'react';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Button from 'material-ui/Button';
import styles from './styles';

import SettingsModel from './SettingsModal';

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
    const menuItems = [
      buttonsModel.dashboard,
      buttonsModel.export,
      buttonsModel.download
    ];

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
          {menuItems.map(item => (
            <MenuItem
              key={item.button.text}
              onClick={() => {
                this.handleClose();
                item.button.onClick();
              }}
            >
              {item.button.text}
            </MenuItem>
          ))}
          <MenuItem>
            <a href={buttonsModel.projector.href}>Projector View</a>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const SessionUtils = ({ classes, session, toggle, token }) => {
  const buttonsModel = SessionUtilsButtonsModel(session, toggle, token);

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
          <ControlButton btnModel={buttonsModel.current} classes={classes} />
        </Grid>
        <Grid item xs={2}>
          <SettingsModel session={session} />
        </Grid>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <UtilsMenu buttonsModel={buttonsModel} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(SessionUtils);
