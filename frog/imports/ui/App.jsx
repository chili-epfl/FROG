import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Nav, NavItem } from 'react-bootstrap';
import { restartSession } from '../api/sessions';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const DEFAULT_PASSWORD = '123456';
const connectWithDefaultPwd = username =>
  Meteor.loginWithPassword(username, DEFAULT_PASSWORD);

const apps = ['Home', 'Admin', 'Graph Editor', 'Teacher View', 'Student View'];
const appSlugs = {
  '': 'Home',
  admin: 'Admin',
  graph: 'Graph Editor',
  teacher: 'Teacher View',
  student: 'Student View'
};

const Navigation = ({ appList, changeFn, currentApp }) => (
  <Nav bsStyle="pills" activeKey={currentApp} onSelect={changeFn}>
    {appList.map(app => <NavItem key={app} eventKey={app}>{app}</NavItem>)}
  </Nav>
);

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { app: 'Home' };
    window.switchUser = username => {
      this.createOrLogin(username);
      const app = username === 'teacher' ? 'Teacher View' : 'Student View';
      this.setState({ app });
    };
    window.restartSession = restartSession;
  }

  createOrLogin = username => {
    if (username) {
      if (!Meteor.users.findOne({ username })) {
        Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
          connectWithDefaultPwd(username)
        );
        if (appSlugs[location]) {
          this.setState({ app: appSlugs[location] });
        }
      } else {
        connectWithDefaultPwd(username);
      }
    }
  };

  render() {
    return (
      <div>
        <div id="header">
          <AccountsUIWrapper />
          <Navigation
            appList={apps}
            currentApp={this.state.app}
            changeFn={app => {
              this.setState({ app });
              this.updateAddressbar(app);
            }}
          />
        </div>
        <div id="body">
          {this.state.app === 'Home'
            ? <h1>
                FROG{' '}
                <small> - Fabricating and Running Orchestration Graphs</small>
              </h1>
            : null}
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
