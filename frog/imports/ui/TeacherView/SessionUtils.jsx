// @flow

import * as React from 'react';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { setTeacherSession } from '../../api/sessions';

import {
  ToolTipComponent,
  SessionUtilsButtonsModel
} from './utils/buttonUtils.js';

const styles = {
  textCenter: {
    textAlign: 'center'
  }
};

const DashToggle = ({
  visible,
  toggleVisible
}: {
  visible: boolean,
  toggleVisible: Function
}) => (
  <ToolTipComponent
    tooltip={{
      id: 'tooltip-dashtoggle',
      title: 'Toggle between dashboard and graph view',
      placement: 'bottom'
    }}
  >
    <Button variant="raised" color="primary" onClick={toggleVisible}>
      {visible ? 'Graph' : 'Dashboard'}
    </Button>
  </ToolTipComponent>
);

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
    <Grid container alignItems="center">
      <Grid item xs={4} className={classes.textCenter}>
        <Typography>Current Session: {session.slug}</Typography>
      </Grid>
      <Grid item xs={4} className={classes.textCenter}>
        <DashToggle visible={visible} toggleVisible={toggle} />
      </Grid>
      <Grid item xs={4} style={{ textAlign: 'right' }}>
        <UtilsMenu buttonsModel={buttonsModel} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(SessionUtils);
