// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { sample } from 'lodash';
import FlexView from 'react-flexview';

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
  if (process.env.NODE_ENV !== 'production') {
    const name = randomName();
    return (
      <div style={{ margin: '25px' }}>
        <h1>FROG: Not logged in</h1>
        <FlexView>
          <div style={{ width: '50%' }}>
            <h3>How to login as any user during development</h3>
            <p>
              FROG is currently in development mode, to access teacher mode, use{' '}
              <b>
                <i>{`<FROG_URL>?login=teacher`}</i>
              </b>. Or, to create/log in as a student, use{' '}
              <b>
                <i>{`<FROG_URL>?login=<student_name>`}</i>
              </b>.{' '}
            </p>
            <p>
              <b>
                <i>{`<FROG_URL>`}</i>
              </b>{' '}
              is typically{' '}
              <b>
                <i>http://localhost:3000</i>
              </b>, so a typical student login could be{' '}
              <b>
                <i>http://localhost:3000?login=peter</i>
              </b>.
            </p>
            <p>
              You can log in as one user in one tab, and another user in another
              tab, however on reload, all tabs will log in as the last user
              (unless you use different browsers, privacy-mode etc). A quick
              work-around is to define in /etc/hosts:
            </p>
            <pre>{`127.0.0.1	localhost
127.0.0.1	dev1
127.0.0.1	dev2
127.0.0.1	dev3
127.0.0.1	dev4`}</pre>
            <p>
              That way, you can log in to{' '}
              <b>
                <i>http://localhost:3000</i>
              </b>{' '}
              as teacher, and{' '}
              <b>
                <i>http://dev1:3000</i>{' '}
              </b>{' '}
              as a student, and these logins will survive reloads.
            </p>
            <p>
              More information for developers about code style, developer tools,{' '}
              type definitions, and data structures, on the{' '}
              <b>
                <a href="https://github.com/chili-epfl/frog">GitHub wiki</a>.
              </b>
            </p>
          </div>
          <FlexView vAlignContent="top" marginLeft={40} width="50%">
            <div>
              <h3>Shortcuts</h3>
              <ul>
                <li>
                  <Link to="?login=teacher">Log in as teacher</Link>
                </li>
                <li>
                  <Link to={`?login=${name}`}>Log in as {name} (student)</Link>
                </li>
              </ul>
            </div>
          </FlexView>
        </FlexView>
      </div>
    );
  } else return <p>Not logged in</p>;
};

NotLoggedIn.displayName = 'NotLoggedIn';
export default NotLoggedIn;
