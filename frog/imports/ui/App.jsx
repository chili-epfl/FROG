import React, { Component } from 'react';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = ["home","repository","editor","teacherview","studentview"];

const Buttons = ({apps, changeFn}) => { return(
  <div>
    {apps.map(app => (
      <p className="select" onClick={() => changeFn(app)} key={app}>{app}</p>
    ))}
  </div>
  )
}

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: "home",
    };
  }

  render() {
    return (
      <div>
        <div id="header">
          <h1>FROG - FABRICATING AND RUNNING ORCHESTRATION GRAPHS</h1>
          <Buttons apps={apps} changeFn={(app) => this.setState({app: app})}/>
          <AccountsUIWrapper />
        </div>
        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
