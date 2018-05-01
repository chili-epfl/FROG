// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from 'material-ui/styles';
import styles from './styles';
import { setTeacherSession } from '../../api/sessions';

import {
  ControlButton,
  SessionUtilsButtonsModel,
  DashToggle
} from './utils/buttonUtils.js';

class UtilsMenu extends React.Component<any, { anchorEl: any }> {
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
      buttonsModel.settings,
      buttonsModel.restart,
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
              style={{ color: item.button.color || '#000000' }}
            >
              {item.button.text}
            </MenuItem>
          ))}
          <MenuItem>
            <a
              style={{ textDecoration: 'none', color: '#000000' }}
              href={buttonsModel.projector.href}
              target="_blank"
            >
              Projector View in New Tab
            </a>
          </MenuItem>
          <MenuItem onClick={() => setTeacherSession(undefined)}>
            Quit session
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const SessionUtils = ({
  classes,
  session,
  toggle,
  token,
  visible,
  openSettings
}) => {
  const buttonsModel = SessionUtilsButtonsModel(
    session,
    toggle,
    token,
    openSettings
  );

  return (
    <div className={classes.root}>
      <Grid
        container
        className={classes.root}
        justify="space-between"
        alignItems="center"
        containerspacing={0}
      >
        <Grid item xs={4} className={classes.textCenter}>
          <ControlButton btnModel={buttonsModel.current} classes={classes} />
        </Grid>
        <Grid item>
          <DashToggle visible={visible} toggleVisible={toggle} />
        </Grid>
        <Grid item xs={4} style={{ textAlign: 'right' }}>
          <UtilsMenu buttonsModel={buttonsModel} />
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(SessionUtils);
