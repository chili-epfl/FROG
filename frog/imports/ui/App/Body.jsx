// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Home from './../Home';
import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Admin from './../Admin';

const Body = ({ userId, app }) => {
  if (userId) {
    switch (app) {
      case 'home':
        return <Home />;
      case 'admin':
        return <Admin />;
      case 'graph':
        return <GraphEditor />;
      case 'student':
        return <StudentView />;
      case 'teacher':
        return <TeacherView />;
      default:
        return (
          <p>
            MISSING OR WRONG STATE IN APP COMPONENT: {app}
          </p>
        );
    }
  }
  return (
    <p
    >{`NOT LOGGED IN. FROG is currently in development mode, to access teacher mode, use <FROG_URL>/#/teacher/[view]. [view] could be 'admin', 'graph' or 'teacher' (to run a graph). Or, to create/log in as a student, use <FROG_URL>/#/<student_name>. <FROG_URL> is typically localhost:3000, so a typical student login could be localhost:3000/#/peter.`}</p>
  );
};

export default createContainer(() => ({ userId: Meteor.userId() }), Body);
