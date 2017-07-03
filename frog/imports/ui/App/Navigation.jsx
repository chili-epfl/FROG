// @flow

import React from 'react';
import Meteor from 'meteor/meteor';
import { Nav, NavItem } from 'react-bootstrap';

export default ({
  apps,
  currentApp,
  username
}: {
  apps: Object,
  currentApp: string,
  username: string
}) =>
  <Nav bsStyle="pills" activeKey={currentApp}>
    {Object.keys(apps).map(app =>
      <NavItem key={app} eventKey={app} href={'/#/' + username + '/' + app}>
        {apps[app]}
      </NavItem>
    )}
  </Nav>;
