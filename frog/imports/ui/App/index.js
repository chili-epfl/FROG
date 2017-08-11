// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import { every } from 'lodash';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Body from './Body.jsx';
import Navigation from './Navigation';

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

// App component - represents the whole app
// export default class App extends Component {
//   state: { app: string, username: string };
//
//   constructor() {
//     super();
//     this.state = { app: 'home', username: '' };
//     Meteor.subscribe('userData', {
//       onReady: () => {
//         this.handleNewHash();
//         window.addEventListener('hashchange', this.handleNewHash, false);
//       }
//     });
//   }
//
//   handleNewHash = () => {
//     const [, username, location] = window.location.hash.split('/');
//     const loggedInUsername =
//       Meteor.userId() && Meteor.users.findOne(Meteor.userId()).username;
//     if (username && username !== loggedInUsername) {
//       if (!Meteor.users.findOne({ username })) {
//         Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
//           connectWithDefaultPwd(username)
//         );
//       } else {
//         connectWithDefaultPwd(username);
//       }
//     }
//     this.setState({ username });
//     if (username !== 'teacher') {
//       this.setState({ app: 'student' });
//     } else if (location && apps[location]) {
//       this.setState({ app: location });
//     }
//   };
/* <PageContainer
    username={this.state.username === undefined ? '' : this.state.username}
    apps={apps}
    currentApp={this.state.app === undefined ? '' : this.state.app}
  /> */

export default () =>{
  console.log('Dans l\'App');
  return (<Router>
    <div>
      <Route path="/:username" component={PageContainer} />
      <Route path="/:username/:app" component={PageContainer} />
    </div>
  </Router>);
};

// const User = ({match}) => {
//   <Router>
//     <Route path='/:app' component={}/>
//   </Router>
// }

export const Page = ({ match }) => {
  console.log('Dans la page');
  if (!match.params.ready) return <div id="app" />;
  return (
    <div id="app">
      {match.params.username === 'teacher' &&
        <div id="header">
          <Navigation
            username={match.params.username}
            apps={apps}
            currentApp={match.params.currentApp ? match.params.currentApp : 'Home'}
          />
        </div>}
      <div id="body">
        <Body app={match.params.currentApp} />
      </div>
    </div>
  );
};

const setupSubscriptions = (collections: string[]) => {
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return every(subscriptions.map(x => x.ready()), Boolean);
};

const PageContainer = createContainer(({ match }) => {
  const username = match.params.username;
  const app = match.params.app ? match.params.app : 'Home';
  console.log('Dans le PageContainer');
  let ready = setupSubscriptions([
    'userData',
    'activity_data',
    'logs',
    'activities',
    'objects',
    'sessions',
  ]);

  if (match.params.username === 'teacher') {
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

  return { match: { params: { username, currentApp: match.params.app, ready } } };
}, Page);
