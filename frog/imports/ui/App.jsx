import React, { Component } from 'react';

import Body from './Body.jsx';
import HeaderButton from './HeaderButton.jsx';

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    // The state of the App component indicates what the app is showing
    // The display automatically updates itself on a call of setState()
    // The Body component has app={this.state.app} as a property
    this.state = {
      app: "home",
    };
  }

  renderButtons() {
    var apps = ["home","repository","editor","engine","analytics","admin"];
    return apps.map((app) => ({
      id: app,
      onClick: ()=>(this.setState({ app: app })),
    })).map((app) => (
      <HeaderButton data={app} key={app.id}/>
    ));
  }

  render() {
    return (
      <div>
        <div id="header">
          <h1>FROG - FABRICATING AND RUNNING ORCHESTRATION GRAPHS</h1>
          {this.renderButtons()}
        </div>
        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
