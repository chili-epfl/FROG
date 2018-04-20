// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import { compose } from 'recompose';
import { Meteor } from 'meteor/meteor';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';

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

class TopBarController extends React.Component<{ classes: any }, {}> {
  routes = [
    { name: 'Graph Editor', to: '/graph' },
    { name: 'Sessions', to: '/teacher' },
    {
      name: 'Preview',
      to: '/preview'
    }
  ];

  value = '/preview';

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
              fullWidth
            >
              {this.routes.map(route => (
                <Tab
                  key={route.to}
                  label={route.name}
                  component={Link}
                  to={route.to}
                  value={route.to}
                />
              ))}
            </Tabs>
            <Button
              className={classes.button}
              color="inherit"
              onClick={() => {
                Meteor.logout();
                window.location.assign('/');
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const TopBar = compose(withRouter, withStyles(styles))(TopBarController);

TopBar.displayName = 'TopBar';
export default TopBar;
