import React, { Component } from 'react';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = ["home","editor","teacherview","studentview"];

const Buttons = ({apps, changeFn, currentApp}) => { return(
  <ul className='nav nav-pills'>
    {apps.map(app => (
      <li key={app} className={app == currentApp ? 'active' : ''}>
        <a href='#' onClick={() => changeFn(app)} key={app}>
          {app}
        </a>
      </li>
    ))}
    <div style={{float: 'right'}}>
          <AccountsUIWrapper />
        </div>
  </ul>
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
        <div>
          <Buttons apps={apps} currentApp={this.state.app} changeFn={(app) => this.setState({app: app})}/>
        </div>
        { this.state.app == 'home' ?
        <div className="page-header" style={{marginTop: '0px'}}>
          <h1>FROG <small> - Fabricating and Running Orchestration Graphs</small></h1>
        </div> :
            null
        }

        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
