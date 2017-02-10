import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Home from './Home.jsx';
import ActivityEditor from './ActivityEditor.jsx';
import StudentView from './StudentView.jsx';
import TeacherView from './TeacherView.jsx';
import GraphEditor from './GraphEditor';
import Admin from './Admin.jsx';

const Body = ({ userId, app }) => {
  if (userId) {
    switch (app) {
      case 'Home':
        return <Home />;
      case 'Admin':
        return <Admin />;
      case 'Activity Editor':
        return <ActivityEditor />;
      case 'Graph Editor':
        return <SVGEditor />;
      case 'Student View':
        return <StudentView />;
      case 'Teacher View':
        return <TeacherView />;
      default:
        return <p>MISSING OR WRONG STATE IN APP COMPONENT: {app}</p>;
    }
  }
  return <p>NOT LOGGED IN. PLEASE SIGN IN OR SIGN UP.</p>;
};

export default createContainer(() => ({ userId: Meteor.userId() }), Body);
