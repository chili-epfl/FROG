import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { A } from 'frog-utils';

const Link = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      activeStyle={{ pointerEvents: 'none', color: '#000000' }}
      activeClassName="active"
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </NavLink>
  </li>
);

const TopBar = () => (
  <React.Fragment>
    <ul className="nav nav-pills">
      <Link to="/admin">Admin</Link>
      <Link to="/graph">Graph Editor</Link>
      <Link to="/preview">Preview</Link>
      <Link to="/teacher">Teacher View</Link>
      <li style={{ float: 'right' }}>
        <A
          onClick={() => {
            Meteor.logout();
            window.location.assign('/');
          }}
        >
          Logout
        </A>
      </li>
    </ul>
  </React.Fragment>
);

TopBar.displayName = 'TopBar';
export default TopBar;
