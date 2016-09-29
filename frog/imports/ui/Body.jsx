import React, { Component } from 'react';

import Repository from './Repository.jsx';
import Editor from './Editor.jsx';
import Engine from './Engine.jsx';
import Analytics from './Analytics.jsx';

export default class Body extends Component {
  render() {
    switch(this.props.app) {
      case "home":
        return (<p>Welcome to FROG project</p>);
        break;
      case "repository":
        return (<Repository />);
        break;
      case "editor":
        return (<Editor />);
        break;
      case "engine":
        return (<Engine />);
        break;
      case "analytics":
        return (<Analytics />);
        break;
      default:
        return (<p>MISSING OR WRONG STATE IN APP COMPONENT</p>);
    }
  };
}
