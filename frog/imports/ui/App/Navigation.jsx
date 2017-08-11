// @flow

import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import { Page } from './index';

export default ({
  apps,
  currentApp,
  username,
}: {
  apps: Object,
  currentApp: string,
  username: string,
}) =>
  <Router>
    <Nav bsStyle="pills" activeKey={currentApp}>
      {Object.keys(apps).map(app =>
        <div key={app}>
          <Link
            to={'/' + username + '/' + app.split(' ').reduce((acc, x) => (acc += x), '') + '/true'}
          >
            <NavItem eventKey={app}>
              {apps[app]}
            </NavItem>
          </Link>
          <Redirect path="/:username/:currentApp/:ready" component={Page} />
        </div>,
      )}
    </Nav>
  </Router>;

// ////////////////////route to nothing
