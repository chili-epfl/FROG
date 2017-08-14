// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { every } from 'lodash';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom';

import Body from './Body.jsx';

const DEFAULT_PASSWORD = '123456';
const connectWithDefaultPwd = username => Meteor.loginWithPassword(username, DEFAULT_PASSWORD);

const apps = {
  home: 'Home',
  admin: 'Admin',
  graph: 'Graph Editor',
  teacher: 'Teacher View',
  student: 'Student View',
};

const socket = new ReconnectingWebSocket('ws://localhost:3002');
export const connection = new sharedbClient.Connection(socket);
window.connection = connection;

export default () => (
    <Router>
      <Route path="/:username/:app" component={PageContainer} />
    </Router>
  );

class Page extends Component {
  state = {
    currentApp: 'home',
  };

  render() {
    console.log(this.props);

    if (!this.props.ready) return <div id="app" style={{ backgroundColor: 'black' }} />;
    return (
      <div id="app">
        <Router>
          <div>
            {this.props.username === 'teacher' &&
              <ul className="nav nav-pills">
                {Object.keys(apps).map(app =>
                  <li
                    key={app}
                    role="presentation"
                    className={
                      app.toString().split(' ')[0].toLowerCase() === this.state.currentApp
                        ? 'active'
                        : ''
                    }
                  >
                    <NavLink
                      to={
                        '/' + this.props.username + '/' + app.toString().split(' ')[0].toLowerCase()
                      }
                      onClick={() => {
                        this.setState({ currentApp: app.toString().split(' ')[0].toLowerCase() });
                      }}
                    >
                      {apps[app]}
                    </NavLink>
                  </li>,
                )}
              </ul>}
            <div id="body">
              <Route path={'/' + this.props.username + '/:app'} component={Body} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

const PageContainer = createContainer((props: { match: Object }) => {
  const username = props.match.params.username;
  let ready = setupSubscriptions([
    'userData',
    'activity_data',
    'logs',
    'activities',
    'objects',
    'sessions',
  ]);
  if (username === 'teacher') {
    ready =
      ready &&
      setupSubscriptions([
        'operators',
        'connections',
        'global_settings',
        'graphs',
        'products',
        'uploads',
      ]);
  }
  Meteor.subscribe('userData', {
    onReady: () => {
      const loggedInUsername = Meteor.userId() && Meteor.users.findOne(Meteor.userId()).username;
      if (username && username !== loggedInUsername) {
        if (!Meteor.users.findOne({ username })) {
          Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
            connectWithDefaultPwd(username),
          );
        } else {
          connectWithDefaultPwd(username);
        }
      }
    },
  });
  return { ...props, username, ready };
}, Page);

const setupSubscriptions = (collections: string[]) => {
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return every(subscriptions.map(x => x.ready()), Boolean);
};
