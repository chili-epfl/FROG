// @flow

import { Meteor } from 'meteor/meteor';
import { InjectData } from 'meteor/staringatlights:inject-data';
import { Accounts } from 'meteor/accounts-base';
import * as React from 'react';
import Modal from 'react-modal';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { withRouter } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toObject as queryToObject } from 'query-parse';

import NotLoggedIn from './NotLoggedIn';
import { ErrorBoundary } from './ErrorBoundary';
import StudentView from '../StudentView';
import StudentLogin from '../StudentView/StudentLogin';
import APICall from './APICall';
import TeacherLoadable from './TeacherContainer';

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
      settings?: Object
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

    componentDidMount() {
      Modal.setAppElement('#render-target');
      window.notReady = this.notReady;
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
        this.props.match.params.slug,
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
          this.setState({ mode: 'waiting' });
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

    notReady = () => {
      this.setState({ mode: 'waiting' }, () => this.update());
    };

    update = () => {
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
                'frog.session.settings',
                this.props.match.params.slug,
                (err, result) => {
                  if (err || result === -1) {
                    this.setState({ mode: 'nostudentlist' });
                  } else {
                    this.setState({ settings: result, mode: 'studentlist' });
                  }
                }
              );
            }
          }
        }
      }
    };

    render() {
      const query = queryToObject(this.props.location.search.slice(1));
      if (query.login) {
        return <Redirect to={this.props.location.pathname} />;
      } else if (this.state.mode === 'loggingIn') {
        return <CircularProgress />;
      } else if (this.state.mode === 'ready' && Meteor.user()) {
        if (Meteor.user().username === 'teacher') {
          return (
            <Switch>
              <Route path="/projector/:slug" component={StudentView} />
              <Route component={TeacherLoadable} />
            </Switch>
          );
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
        return <h1>There was an error logging in</h1>;
      }
      return this.state.mode === 'studentlist' && this.state.settings ? (
        <StudentLogin
          settings={this.state.settings}
          login={this.login}
          slug={this.props.match.params.slug}
        />
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
            <Switch>
              <Route path="/:slug" component={FROGRouter} />
              <Route component={FROGRouter} />
            </Switch>
          </Router>
        </ErrorBoundary>
      );
    }
  }
}
