// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';

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
  };

  componentDidMount = () => {
    window.addEventListener('hashchange', this.handleNewHash, false);
  };

  render() {
    return (
      <PageContainer
        username={this.state.username === undefined ? '' : this.state.username}
        apps={apps}
        currentApp={this.state.app === undefined ? '' : this.state.app}
      />
    );
  }
}

const Page = (props: {
  username: string,
  currentApp: string,
  apps: {},
  ready: boolean
}) => {
  if (!props.ready) return <div id="app" />;
  return (
    <div id="app">
      {props.username === 'teacher' &&
        <div id="header">
          <Navigation
            username={props.username}
            apps={props.apps}
            currentApp={props.currentApp}
          />
        </div>}
      <div id="body">
        <Body app={props.currentApp} />
      </div>
    </div>
  );
};

const PageContainer = createContainer((props: { username: string }) => {
  const h1 = Meteor.subscribe('activity_data');
  const h2 = Meteor.subscribe('logs');
  const h3 = Meteor.subscribe('activities');
  const h4 = Meteor.subscribe('objects');
  const h5 = Meteor.subscribe('sessions');
  let ready =
    h1.ready() && h2.ready() && h3.ready() && h4.ready() && h5.ready();
  if (props.username === 'teacher') {
    const h6 = Meteor.subscribe('operators');
    const h7 = Meteor.subscribe('connections');
    const h8 = Meteor.subscribe('global_settings');
    const h9 = Meteor.subscribe('graphs');
    const h10 = Meteor.subscribe('products');
    const h11 = Meteor.subscribe('uploads');
    ready =
      ready &&
      h6.ready() &&
      h7.ready() &&
      h8.ready() &&
      h9.ready() &&
      h10.ready() &&
      h11.ready();
  }
  return { ...props, ready };
}, Page);
