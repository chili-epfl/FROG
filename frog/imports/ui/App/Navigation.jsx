// @flow

import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

export default ({ apps, currentApp }: { apps: Object, currentApp: string }) =>
  <Nav bsStyle="pills" activeKey={currentApp}>
    {Object.keys(apps).map(app =>
      <NavItem key={app} eventKey={app} href={'/#/' + app}>{apps[app]}</NavItem>
    )}
  </Nav>;
