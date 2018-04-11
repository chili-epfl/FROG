// @flow

import * as React from 'react';
import { A } from 'frog-utils';
import { sample } from 'lodash';
import FlexView from 'react-flexview';
import { Meteor } from 'meteor/meteor';

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

const NotLoggedIn = ({ login }: { login: Function }) => {
  if (
    process.env.NODE_ENV !== 'production' ||
    Meteor.settings.public.friendlyProduction
  ) {
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
            <p>
              127.0.0.1 localhost<br />
              127.0.0.1 dev1<br />
              127.0.0.1 dev2<br />
              127.0.0.1 dev3<br />
              127.0.0.1 dev4
            </p>
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
                  <A onClick={() => login('teacher')}>Log in as teacher</A>
                </li>
                <li>
                  <A onClick={() => login(name)}>Log in as {name} (student)</A>
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
