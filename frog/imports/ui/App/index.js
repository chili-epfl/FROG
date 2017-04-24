// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Body from './Body.jsx';
import AccountsUIWrapper from './../AccountsUIWrapper.jsx';
import Navigation from './Navigation';

const DEFAULT_PASSWORD = '123456';
const connectWithDefaultPwd = username =>
  Meteor.loginWithPassword(username, DEFAULT_PASSWORD);

const apps = {
  home: 'Home',
  admin: 'Admin',
  graph: 'Graph Editor',
  teacher: 'Teacher View',
  student: 'Student View'
};

// App component - represents the whole app
export default class App extends Component {
  state: { app: string };

  constructor() {
    super();
    this.state = { app: 'home' };
  }

  handleNewHash = () => {
    const [, location, username] = window.location.hash.split('/');
    if (username) {
      if (!Meteor.users.findOne({ username })) {
        Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
          connectWithDefaultPwd(username));
      } else {
        connectWithDefaultPwd(username);
      }
    }
    if (location && apps[location]) {
      this.setState({ app: location });
    }
  };

  componentDidMount = () => {
    window.addEventListener('hashchange', this.handleNewHash, false);
    this.handleNewHash();
  };

  render() {
    return (
      <div>
        <div id="header">
          <AccountsUIWrapper />
          <Navigation apps={apps} currentApp={this.state.app} />
        </div>
        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
