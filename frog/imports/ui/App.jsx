import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Nav, NavItem } from 'react-bootstrap';
import SplitPane from 'react-split-pane';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = ['Home', 'Admin', 'Graph Editor', 'Teacher View', 'Student View'];

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
    Meteor.subscribe('userData', { onReady: this.switchAppByUser });
  }

  switchAppByUser = () => {
    const username = Meteor.user() ? Meteor.user().username : 'noname';
    const app = {
      teacher: 'Graph Editor',
      admin: 'Admin',
      noname: 'Home'
    }[username] || 'Student View';
    this.setState({ app });
  };

  render() {
    return (
      <SplitPane
        split="horizontal"
        allowResize={false}
        pane2Style={{ overflow: 'auto' }}
      >
        <div id="header">
          <AccountsUIWrapper />
          <Navigation
            appList={apps}
            currentApp={this.state.app}
            changeFn={app => this.setState({ app })}
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

      </SplitPane>
    );
  }
}
