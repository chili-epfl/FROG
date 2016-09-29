import React, { Component } from 'react';

import Repository from './Repository.jsx';
import Editor from './Editor.jsx';
import Engine from './Engine.jsx';
import Analytics from './Analytics.jsx';

export default class Body extends Component {
  render() {
    // The Body components is the main component of the application
    // It simply performs a switch on the app property set by the App component
    switch(this.props.app) {
      case "home":
        return (<p>Welcome to FROG project</p>);
      case "repository":
        return (<Repository />);
      case "editor":
        return (<Editor />);
      case "engine":
        return (<Engine />);
      case "analytics":
        return (<Analytics />);
      default:
        return (<p>MISSING OR WRONG STATE IN APP COMPONENT</p>);
    }
  };
}
