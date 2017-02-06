import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = [
  'Home',
  'Admin',
  'Activity Editor',
  'New Editor',
  'Graph Editor',
  'Teacher View',
  'Student View'
];

const Buttons = ({ appList, changeFn, currentApp }) => (
  <ul className="nav nav-pills">
    {appList.map(app => (
      <li key={app} className={app === currentApp ? 'active' : ''}>
        <a href="#" onClick={() => changeFn(app)} key={app}>
          {app}
        </a>
      </li>
    ))}
  </ul>
);

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { app: 'Home' };
    Meteor.subscribe('userData', { onReady: this.switchAppByUser });
  }

  switchAppByUser = () => {
    const username = Meteor.user() ? Meteor.user().username : null;
    const app = username
      ? ({ teacher: 'New Editor' })[username] || 'Student View'
      : 'Home';
    this.setState({ app });
  };

  render() {
    return (
      <div>
        <DevTools />
        <Buttons
          appList={apps}
          currentApp={this.state.app}
          changeFn={app => this.setState({ app })}
        />
        <AccountsUIWrapper />
        {this.state.app === 'Home'
          ? <div className="page-header" style={{ marginTop: '0px' }}>
              <h1>
                FROG{' '}
                <small> - Fabricating and Running Orchestration Graphs</small>
              </h1>
            </div>
          : null}
        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
