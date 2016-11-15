import React, { Component } from 'react';

import Body from './Body.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const apps = ["Home","Activity Editor","Graph Editor","Teacher View","Student View"];

const Buttons = ({apps, changeFn, currentApp}) => { return(
  <ul className='nav nav-pills'>
    {apps.map(app => (
      <li key={app} className={app == currentApp ? 'active' : ''}>
        <a href='#' onClick={() => changeFn(app)} key={app}>
          {app}
        </a>
      </li>
    ))}
  </ul>
)}

// App component - represents the whole app
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: "Home",
    };
  }

  render() { return (
    <div>
      <div>
        <Buttons apps={apps} currentApp={this.state.app} changeFn={(app) => this.setState({app: app})}/>
      </div>
      <div>
        <AccountsUIWrapper />
      </div>
      { this.state.app == 'Home' ?
      <div className="page-header" style={{marginTop: '0px'}}>
        <h1>FROG <small> - Fabricating and Running Orchestration Graphs</small></h1>
      </div> :
          null
      }

      <div id="body">
        <Body app={this.state.app} />
      </div>
    </div>
  )}
}
