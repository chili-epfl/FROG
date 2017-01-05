import React, { Component, PropTypes } from 'react';

import Home from './Home.jsx';
import Repository from './Repository.jsx';
import ActivityEditor from './ActivityEditor.jsx';
import GraphEditor from './graph/GraphEditor.jsx';
import StudentView from './StudentView.jsx';
import TeacherView from './TeacherView.jsx';

import Editor from './Editor.jsx';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class Body extends Component {
  render() {
    // The Body components is the main component of the application
    // It simply performs a switch on the app property set by the App component
    if (this.props.currentUser) {
      switch(this.props.app) {
        case "Home":
          return (<Home />);
        case "Activity Editor":
          return (<ActivityEditor />);
        case "Graph Editor":
          return (<Editor />);
          //return (<GraphEditor />);
        case "Student View":
          return (<StudentView />);
        case "Teacher View":
          return (<TeacherView />);
        default:
          return (<p>MISSING OR WRONG STATE IN APP COMPONENT: {this.props.app}</p>);}
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
