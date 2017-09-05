import React from 'react';
import { NavLink } from 'react-router-dom';

const Link = ({ to, children }) =>
  <li>
    <NavLink
      to={to}
      activeStyle={{ pointerEvents: 'none', color: '#000000' }}
      activeClassName="active"
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </NavLink>
  </li>;

const TopBar = () =>
  <ul className="nav nav-pills">
    <Link to="/admin">Admin</Link>
    <Link to="/graph">Graph Editor</Link>
    <Link to="/preview">Preview</Link>
    <Link to="/teacher">Teacher View</Link>
    <Link to="/student">Student View</Link>
  </ul>;

TopBar.displayName = 'TopBar';
export default TopBar;
