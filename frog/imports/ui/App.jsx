import React, { Component } from 'react';

import Body from './Body.jsx';

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

  // This is badly written. Let's rewrite it when we will be more proficient with REACT
  setHome() { this.setState({app: "home",}); }
  setRepository() { this.setState({app: "repository",}); }
  setEditor() { this.setState({app: "editor",}); }
  setEngine() { this.setState({app: "engine",}); }
  setAnalytics() { this.setState({app: "analytics",}); }

  render() {
    return (
      <div>
        <div id="header">
          <h1>FROG - FABRICATING AND RUNNING ORCHESTRATION GRAPHS</h1>
          <p className="select" onClick={this.setHome.bind(this)}>Home</p>
          <p className="select" onClick={this.setRepository.bind(this)}>Repository</p>
          <p className="select" onClick={this.setEditor.bind(this)}>Editor</p>
          <p className="select" onClick={this.setEngine.bind(this)}>Engine</p>
          <p className="select" onClick={this.setAnalytics.bind(this)}>Analytics</p>
        </div>
        <div id="body">
          <Body app={this.state.app} />
        </div>
      </div>
    );
  }
}
