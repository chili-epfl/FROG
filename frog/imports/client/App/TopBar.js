// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { Meteor } from 'meteor/meteor';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';

import ChangelogModal from '../GraphEditor/ChangelogModal';
import { LocalSettings } from '/imports/api/settings';

const styles = theme => ({
  root: {
    flexGrow: 1,
    // marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  toolbar: {
    minHeight: '48px',
    height: '48px'
  },
  tabs: {
    flexGrow: 1
  }
});

class LogoutMenu extends React.Component<*, *> {
  state = {
    anchorEl: null,
    modal: false
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Settings />
        </IconButton>
        <ChangelogModal
          show={this.state.modal}
          hide={() => this.setState({ modal: false })}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              this.setState({ modal: true });
              this.handleClose();
            }}
          >
            Show changelog
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open('https://froglearning.wordpress.com');
              this.handleClose();
            }}
          >
            Website
          </MenuItem>
          <MenuItem
            onClick={() => {
              sessionStorage.removeItem('frog.sessionToken');
              Meteor.logout();
              this.props.history.push('/');
              window.notReady();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

class TopBarController extends React.Component<
  { classes: any, history: any, location: any },
  {}
> {
  routes = [
    { name: 'Graph Editor', to: '/teacher/graph' },
    { name: 'Sessions', to: '/teacher/orchestration' },
    {
      name: 'Activity Preview',
      to: '/teacher/preview'
    }
  ];

  value = '/teacher/preview';

  constructor(props) {
    super(props);
    const found = this.routes.filter(
      route => props.location.pathname.indexOf(route.to) !== -1
    )[0];

    if (found !== undefined) {
      this.value = found.to;
    }
  }

  handleChange = (event, value) => {
    this.value = value;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar className={classes.toolbar}>
            <Typography type="subheading" color="inherit">
              Teacher View
            </Typography>
            <Tabs
              className={classes.tabs}
              value={this.value}
              onChange={this.handleChange}
              variant="fullWidth"
            >
              {this.routes.map(route => (
                <Tab
                  key={route.to}
                  label={route.name}
                  component={Link}
                  to={route.to + LocalSettings.UrlCoda}
                  value={route.to}
                />
              ))}
            </Tabs>
            <h3>
              {LocalSettings.researchLogin ? ' * ' : ''}
              {Meteor.user().username}
            </h3>
            <LogoutMenu history={this.props.history} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const TopBar = compose(
  withRouter,
  withStyles(styles)
)(TopBarController);

TopBar.displayName = 'TopBar';
export default TopBar;
