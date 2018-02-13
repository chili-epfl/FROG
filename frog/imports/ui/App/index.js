// @flow

import { Meteor } from 'meteor/meteor';
import { InjectData } from 'meteor/staringatlights:inject-data';
import { Accounts } from 'meteor/accounts-base';
import * as React from 'react';
import sharedbClient from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnectingwebsocket';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import Spinner from 'react-spinner';
import { toObject as queryToObject } from 'query-parse';

import NotLoggedIn from './NotLoggedIn';
import { ErrorBoundary } from './ErrorBoundary';
import StudentView from '../StudentView';
import StudentLogin from '../StudentView/StudentLogin';
import APICall from './APICall';
import TeacherLoadable from './TeacherContainer';

const shareDbUrl =
  (Meteor.settings.public && Meteor.settings.public.sharedburl) ||
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

const FROGRouter = withRouter(
  class RawRouter extends React.Component<
    Object,
    {
      mode:
        | 'ready'
        | 'loggingIn'
        | 'error'
        | 'waiting'
        | 'studentlist'
        | 'nostudentlist',
      studentlist?: string[]
    }
  > {
    wait: boolean = false;

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

    login = (username: string, token?: string, isStudentList?: boolean) => {
      this.setState({ mode: 'loggingIn' });
      Meteor.call(
        'frog.username.login',
        username,
        token,
        isStudentList,
        (err, id) => {
          subscriptionCallback(err, id, x => this.setState({ mode: x }));
        }
      );
    };

    tokenLogin(token, slug) {
      this.setState({ mode: 'loggingIn' });
      Accounts.loginWithToken(token, err => {
        if (err) {
          Accounts._unstoreLoginToken();
          this.setState({ mode: 'error' });
        } else {
          Meteor.subscribe('userData', {
            onReady: () => {
              this.setState({ mode: 'ready' });
            }
          });
          if (slug) {
            this.props.history.push('/' + slug);
          }
        }
      });
    }

    update() {
      this.wait = true;
      InjectData.getData('login', data => {
        if (data && data.token) {
          this.tokenLogin(data.token, data.slug);
        } else {
          this.wait = false;
        }
      });
      if (!this.wait) {
        const query = queryToObject(this.props.location.search.slice(1));
        const hasLogin = query.login;

        if (this.state.mode !== 'loggingIn') {
          const username = query.login;
          if (username) {
            this.login(username, query.token);
          }
          if (!hasLogin && this.state.mode !== 'ready') {
            if (Accounts._storedLoginToken()) {
              this.tokenLogin(Accounts._storedLoginToken());
            } else if (this.props.match.params.slug) {
              this.setState({ mode: 'loggingIn' });
              Meteor.call(
                'frog.studentlist',
                this.props.match.params.slug,
                (err, result) => {
                  if (err || result === -1 || isEmpty(result)) {
                    this.setState({ mode: 'nostudentlist' });
                  } else {
                    this.setState({ studentlist: result, mode: 'studentlist' });
                  }
                }
              );
            }
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
      if (this.state.mode === 'error') {
        return <p1>There was an error logging in</p1>;
      }
      return this.state.mode === 'studentlist' ? (
        <StudentLogin login={this.login} slug={this.props.match.params.slug} />
      ) : (
        <NotLoggedIn login={this.login} />
      );
    }
  }
);

export default class Root extends React.Component<
  {},
  {
    mode: string,
    api?: boolean,
    data?: Object
  }
> {
  constructor() {
    super();
    this.state = { mode: 'waiting' };
  }

  componentDidMount = () => {
    InjectData.getData('api', data => {
      this.setState({ mode: 'ready', api: !!data, data });
    });
  };

  render() {
    if (this.state.mode === 'waiting') {
      return null;
    } else if (this.state.api && this.state.data) {
      return <APICall data={this.state.data} />;
    } else {
      return (
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
    }
  }
}
