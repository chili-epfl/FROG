// @flow

import { Meteor } from 'meteor/meteor';
import path from 'path';
import Loadable from 'react-loadable';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { isEmpty } from 'lodash';
import Spinner from 'react-spinner';
import { toObject as queryToObject } from 'query-parse';
import NotLoggedIn from './NotLoggedIn';
import { ErrorBoundary } from './ErrorBoundary';

import StudentView from '../StudentView';
import StudentLogin from '../StudentView/StudentLogin';

const TeacherLoadable = Loadable({
  loader: () => import('./TeacherContainer'),
  loading: () => null,
  serverSideRequirePath: path.resolve(__dirname, './TeacherContainer')
});

const shareDbUrl =
  (Meteor.settings && Meteor.settings.public.sharedburl) ||
  (window.location.protocol === 'https:' ? 'wss:' : 'ws:') +
    '//' +
    window.location.hostname +
    ':3002';

const socket = new ReconnectingWebSocket(shareDbUrl);
export const connection = new sharedbClient.Connection(socket);

if (process.env.NODE_ENV !== 'production') {
  window.connection = connection;
}

Accounts._autoLoginEnabled = false;
Accounts._initLocalStorage();

const subscriptionCallback = (error, response, setState) => {
  if (response === 'NOTVALID') {
    setState('error');
  } else {
    Accounts.makeClientLoggedIn(
      response.id,
      response.token,
      response.tokenExpires
    );
    Accounts._storeLoginToken(
      response.id,
      response.token,
      response.tokenExpires
    );
    Meteor.subscribe('userData', { onReady: () => setState('ready') });
  }
};

class FROGRouter extends Component {
  state: {
    mode: 'ready' | 'loggingIn' | 'error' | 'waiting' | 'studentlist',
    studentlist?: string[]
  };

  constructor(props) {
    super(props);
    this.state = { mode: 'waiting' };
    if (Meteor.user()) {
      Meteor.subscribe('userData', {
        onReady: () => this.setState({ mode: 'ready' })
      });
    }
  }

  componentWillMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.mode === 'waiting' &&
      prevProps.location.search !== this.props.location.search
    ) {
      this.update();
    }
  }

  login = (username: string) => {
    this.setState({ mode: 'loggingIn' });
    Meteor.call('frog.debuglogin', username, (err, id) => {
      subscriptionCallback(err, id, x => this.setState({ mode: x }));
    });
  };

  update() {
    const query = queryToObject(this.props.location.search.slice(1));
    const hasLogin = query.login;

    if (this.state.mode !== 'loggingIn') {
      if (true) {
        // (process.env.NODE_ENV !== 'production') {
        const username = query.login;
        if (username) {
          this.setState({ mode: 'loggingIn' });
          Meteor.call('frog.debuglogin', username, (err, id) => {
            subscriptionCallback(err, id, x => this.setState({ mode: x }));
          });
        }

        const token = query.token;
        if (token) {
          this.setState({ mode: 'loggingIn' });
          Meteor.call('frog.teacherlogin', token.trim(), (err, id) =>
            subscriptionCallback(err, id, x => {
              this.setState({ mode: x });
            })
          );
        }
      }

      if (!hasLogin && this.state.mode !== 'ready') {
        if (Accounts._storedLoginToken()) {
          this.setState({ mode: 'loggingIn' });
          Accounts.loginWithToken(Accounts._storedLoginToken(), err => {
            if (err) {
              Accounts._unstoreLoginToken();
              this.setState({ mode: 'error' });
            } else {
              Meteor.subscribe('userData', {
                onReady: () => this.setState({ mode: 'ready' })
              });
            }
          });
        } else if (this.props.match.params.slug) {
          this.setState({ mode: 'loggingIn' });
          Meteor.call(
            'frog.studentlist',
            this.props.match.params.slug,
            (err, result) => {
              if (err || result === -1 || isEmpty(result)) {
                this.setState({ mode: 'error' });
              } else {
                this.setState({ studentlist: result, mode: 'studentlist' });
              }
            }
          );
        }
      }
    }
  }

  render() {
    const query = queryToObject(this.props.location.search.slice(1));
    if (query.login) {
      return <Redirect to={this.props.location.pathname} />;
    } else if (this.state.mode === 'loggingIn') {
      return <Spinner />;
    } else if (this.state.mode === 'ready' && Meteor.user()) {
      if (Meteor.user().username === 'teacher') {
        return <Route component={TeacherLoadable} />;
      } else {
        return (
          <Switch>
            <Route path="/:slug" component={StudentView} />
            <Route component={() => <h1>No session specified</h1>} />
          </Switch>
        );
      }
    }
    return this.state.mode === 'studentlist' ? (
      <StudentLogin login={this.login} slug={this.props.match.params.slug} />
    ) : (
      <NotLoggedIn login={this.login} />
    );
  }
}

export default () => (
  <ErrorBoundary>
    <Router>
      <div style={{ width: '100%', height: '100%' }}>
        <Switch>
          <Route path="/:slug" component={FROGRouter} />
          <Route component={FROGRouter} />
        </Switch>
      </div>
    </Router>
  </ErrorBoundary>
);
