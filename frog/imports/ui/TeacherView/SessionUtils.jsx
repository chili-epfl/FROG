import * as React from 'react';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { withState, compose } from 'recompose';
import { withStyles } from 'material-ui/styles';
import styles from './styles';
import LIDashboard from '../Dashboard/LIDashboard';

import {
  ControlButton,
  SessionUtilsButtonsModel
} from './utils/buttonUtils.js';

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
      buttonsModel.download,
      buttonsModel.liDashboard
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
            <a href={buttonsModel.projector.href} target="_blank">
              Projector View
            </a>
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
  dashboardVisible,
  setDashboardVisible
}) => {
  const buttonsModel = SessionUtilsButtonsModel(session, toggle, token, () =>
    setDashboardVisible(true)
  );

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid
          container
          className={classes.root}
          justify="space-between"
          alignItems="center"
          containerspacing={0}
        >
          <Grid item xs={4} />
          <Grid item xs={4} className={classes.textCenter}>
            <ControlButton btnModel={buttonsModel.current} classes={classes} />
          </Grid>
          <Grid item xs={4} style={{ textAlign: 'right' }}>
            <UtilsMenu buttonsModel={buttonsModel} />
          </Grid>
        </Grid>
      </div>
      {dashboardVisible && <LIDashboard sessionId={session._id} />}
    </React.Fragment>
  );
};

export default compose(
  withStyles(styles),
  withState('dashboardVisible', 'setDashboardVisible', false)
)(SessionUtils);
