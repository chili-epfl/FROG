// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'recompose';
import { getUsername } from '/imports/api/users';
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
    flexGrow: 1
  },
  appbar: {
    background: theme.palette.primary.main,
    boxShadow: '0 0 10px rgba(0,0,0,0.05)'
  },
  button: {
    margin: theme.spacing()
  },
  rightIcon: {
    marginLeft: theme.spacing()
  },
  toolbar: {
    minHeight: '48px',
    height: '48px'
  },
  toolbarHeading: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: '#FFF',
    marginRight: '20px'
  },
  tabs: {
    flexGrow: 1
  },
  tab: {
    fontSize: '1.1rem',
    textTransform: 'capitalize',
    color: '#FFF'
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
              Meteor.logout(() => {
                this.props.history.push('/');
                window.notReady();
              });
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

type RouteT = {
  name: string,
  to: string[]
};
class TopBarController extends React.Component<
  { classes: any, history: any, location: any },
  { active: string }
> {
  routes: RouteT[] = [
    { name: 'Graph Editor', to: ['/teacher/graph'] },
    { name: 'Sessions', to: ['/teacher/orchestration', '/t'] },
    {
      name: 'Activity Preview',
      to: ['/teacher/preview']
    }
  ];

  splitPath = this.props.location.pathname.split('/');

  constructor(props) {
    super(props);
    const found = this.routes.find(route => this.matchLocationPrefix(route));
    this.state = {
      active: found?.name || 'Graph Editor'
    };
  }

  // Returns the path which contains location path as its prefix (undefined if none have it as prefix)
  matchLocationPrefix = (route: RouteT) => {
    return route.to.find(to =>
      to
        .split('/')
        .reduce(
          (acc, word, idx) =>
            acc && (!this.splitPath[idx] || this.splitPath[idx] === word),
          true
        )
    );
  };

  handleChange = (event, value) => {
    this.setState({ active: value });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="inherit" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <Typography
              type="subheading"
              color="inherit"
              className={classes.toolbarHeading}
            >
              Teacher View
            </Typography>
            <Tabs
              className={classes.tabs}
              value={this.state.active}
              onChange={this.handleChange}
              indicatorColor="primary"
              centered="true"
            >
              {this.routes.map(route => (
                <Tab
                  key={route.name}
                  label={route.name}
                  component={Link}
                  className={classes.tab}
                  to={
                    (this.matchLocationPrefix(route) || route.to[0]) +
                    LocalSettings.UrlCoda
                  }
                  value={route.name}
                />
              ))}
            </Tabs>
            <h3
              style={{
                color: '#FFF',
                marginRight: '10px',
                fontWeight: '400',
                fontSize: '1rem'
              }}
            >
              {LocalSettings.researchLogin ? ' * ' : ''}
              {getUsername()}
            </h3>
            <LogoutMenu history={this.props.history} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const TopBar = compose(withRouter, withStyles(styles))(TopBarController);

TopBar.displayName = 'TopBar';
export default TopBar;
