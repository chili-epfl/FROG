// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';

import { Files } from '/imports/api/activities';

import Body from './Body.jsx';
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

const socket = new ReconnectingWebSocket('ws://localhost:3002');
export const connection = new sharedbClient.Connection(socket);
window.connection = connection;

// App component - represents the whole app
export default class App extends Component {
  state: { app: string, username: string };

  constructor() {
    super();
    this.state = { app: 'home', username: '' };
    Meteor.subscribe('userData', { onReady: this.handleNewHash });
  }

  handleNewHash = () => {
    if (window.location.hash) {
      const [, username, location] = window.location.hash.split('/');
      if (username) {
        if (!Meteor.users.findOne({ username })) {
          Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
            connectWithDefaultPwd(username)
          );
        } else {
          connectWithDefaultPwd(username);
        }
      }
      this.setState({ username });
      if (username !== 'teacher') {
        this.setState({ app: 'student' });
      } else if (location && apps[location]) {
        this.setState({ app: location });
      }
    } else {
      const [, type, fileName] = window.location.pathname.split('/');
      if (type === 'file') {
        const file = Files.find({name: fileName}).fetch()[0];
        this.setState({ app: 'data' });
      }
    }
  };

  componentDidMount = () => {
    window.addEventListener('hashchange', this.handleNewHash, false);
  };

  render(){
    let page = null;
    if(this.state.app === 'data'){
      const [, type, fileName] = window.location.pathname.split('/');
      console.log(type);
      console.log(fileName);
      if(type === 'file')
        page = <img src={Files.find({name: fileName}).fetch()[0].url} alt='' />;
    }else {
      page =
        <div id="app">
          {this.state.username === 'teacher' &&
            <div id="header">
              <Navigation
                username={this.state.username}
                apps={apps}
                currentApp={this.state.app}
              />
            </div>}
          <div id="body">
            <Body app={this.state.app} />
          </div>
        </div>;
    }
    return <div>{page}</div>;
  };
}
