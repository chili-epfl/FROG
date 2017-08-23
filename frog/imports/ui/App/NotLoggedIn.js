// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { sample } from 'lodash';

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

const NotLoggedIn = () => {
  const name = randomName();
  return (
    <div>
      <h1>FROG: Not logged in</h1>
      <p>
        {`FROG is currently in development mode, to access teacher mode, use <FROG_URL>/#/teacher/[view]. [view] could be 'admin', 'graph' or 'teacher' (to run a graph). Or, to create/log in as a student, use <FROG_URL>/#/<student_name>. <FROG_URL> is typically localhost:3000, so a typical student login could be localhost:3000/#/peter.`}
      </p>
      <ul>
        <li>
          <Link to="/graph?login=teacher">Log in as teacher</Link>
        </li>
        <li>
          <Link to={`/student?login=${name}`}>
            Log in as {name} (student)
          </Link>
        </li>
      </ul>
    </div>
  );
};

NotLoggedIn.displayName = 'NotLoggedIn';
export default NotLoggedIn;
