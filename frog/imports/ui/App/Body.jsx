// @flow

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { sample } from 'lodash';

import Home from './../Home';
import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Admin from './../Admin';

const randomName = () =>
  sample([
    'Per',
    'Ole',
    'Jan',
    'Trine',
    'Ali',
    'Leon',
    'Chen Xi',
    'Ahmed',
    'Rina',
    'Jean',
    'Rudolf'
  ]);

const Body = ({ userId, match }) => {
  if (userId) {
    switch (match.params.app) {
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
            MISSING OR WRONG STATE IN APP COMPONENT: {match.params.app}
          </p>
        );
    }
  }
  const name = randomName();
  return (
    <div>
      <h1>FROG: Not logged in</h1>
      <p>
        {`FROG is currently in development mode, to access teacher mode, use <FROG_URL>/#/teacher/[view]. [view] could be 'admin', 'graph' or 'teacher' (to run a graph). Or, to create/log in as a student, use <FROG_URL>/#/<student_name>. <FROG_URL> is typically localhost:3000, so a typical student login could be localhost:3000/#/peter.`}
      </p>
      <ul>
        <li>
          <a href="#/teacher">Log in as teacher</a>
        </li>
        <li>
          <a href={'#/' + name}>
            Log in as {name} (student)
          </a>
        </li>
      </ul>
    </div>
  );
};

export default createContainer(() => ({ userId: Meteor.userId() }), Body);
