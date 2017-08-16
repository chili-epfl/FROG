import React from 'react';
import { NavLink } from 'react-router-dom';

const TopBar = () =>
  <ul className="nav nav-pills">
    <li>
      <NavLink to="/admin" activeClassName="active">
        Admin
      </NavLink>
    </li>
    <li>
      <NavLink to="/graph" activeClassName="active">
        Graph Editor
      </NavLink>
    </li>
    <li>
      <NavLink to="/teacher" activeClassName="active">
        Teacher View
      </NavLink>
    </li>
    <li>
      <NavLink to="/student" activeClassName="active">
        Student View
      </NavLink>
    </li>
  </ul>;

TopBar.displayName = 'TopBar';
export default TopBar;
