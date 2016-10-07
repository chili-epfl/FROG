import React, { Component } from 'react';

import Repository from './Repository.jsx';
import Editor from './Editor.jsx';
import Engine from './Engine.jsx';
import Analytics from './Analytics.jsx';
import Admin from './Admin.jsx';
import Home from './Home.jsx';

export default class Body extends Component {
  render() {
    // The Body components is the main component of the application
    // It simply performs a switch on the app property set by the App component
    switch(this.props.app) {
      case "home":
        return (<Home />);
      case "repository":
        return (<Repository />);
      case "editor":
        return (<Editor />);
      case "engine":
        return (<Engine />);
      case "analytics":
        return (<Analytics />);
      case "admin":
        return (<Admin />);
      default:
        return (<p>MISSING OR WRONG STATE IN APP COMPONENT</p>);
    }
  };
}
