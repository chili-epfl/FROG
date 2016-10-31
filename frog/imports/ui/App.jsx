import React, { Component } from 'react';

import Body from './Body.jsx';
import HeaderButton from './HeaderButton.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = ["home","repository","editor","engine","analytics","admin", "activities"];

const Buttons = ({apps, changeFn}) => {
  return(
    <div>
      {apps.map(app => (
        <HeaderButton data={{id: app, onClick: () => changeFn(app)}} key={app}/>
      ))}
    </div>
  )
}

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
