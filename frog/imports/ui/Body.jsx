import React, { Component, PropTypes } from 'react';

import Repository from './Repository.jsx';
import Editor from './Editor.jsx';
import Engine from './Engine.jsx';
import Analytics from './Analytics.jsx';
import Home from './Home.jsx';
import StudentView from './StudentView.jsx'
import TeacherView from './TeacherView.jsx'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class Body extends Component {
  render() {
    // The Body components is the main component of the application
    // It simply performs a switch on the app property set by the App component
    if (this.props.currentUser) {
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
        case "studentview":
          return (<StudentView />);
        case "teacherview":
          return (<TeacherView />);
        default:
          return (<p>MISSING OR WRONG STATE IN APP COMPONENT</p>);}
    } else {
      return (<p>NOT LOGGED IN. PLEASE SIGN IN OR SIGN UP. HELLO.</p>);
    }
  };
}

Body.propTypes = {
  currentUser: PropTypes.string,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.userId(),
  };
}, Body);
