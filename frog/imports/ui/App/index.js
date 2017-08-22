// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { every } from 'lodash';

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
  student: 'Student View',
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
    Meteor.subscribe('userData', {
      onReady: () => {
        this.handleNewHash();
        window.addEventListener('hashchange', this.handleNewHash, false);
      },
    });
  }

  handleNewHash = () => {
    const [, username, location] = window.location.hash.split('/');
    const loggedInUsername =
      Meteor.userId() && Meteor.users.findOne(Meteor.userId()).username;
    if (username && username !== loggedInUsername) {
      if (!Meteor.users.findOne({ username })) {
        Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
          connectWithDefaultPwd(username),
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
  ready: boolean,
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

const setupSubscriptions = (collections: string[]) => {
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return every(subscriptions.map(x => x.ready()), Boolean);
};

const PageContainer = createContainer((props: { username: string }) => {
  let ready = setupSubscriptions([
    'activity_data',
    'logs',
    'activities',
    'objects',
    'sessions',
    'openUploads',
  ]);
  if (props.username === 'teacher') {
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
  return { ...props, ready };
}, Page);
