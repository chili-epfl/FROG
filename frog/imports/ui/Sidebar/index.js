// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyle = makeStyles(() => ({
  root: {
    width: '250px',
    height: '100%',
    background: grey[100],

    display: 'flex',
    flexFlow: 'column nowrap'
  }
}));

type SidebarPropsT = {
  children: React.Node[]
};

/**
 * The base component for a sidebar in FROG. Is composed of a number of panels.
 */
export const Sidebar = (props: SidebarPropsT) => {
  const classes = useStyle();
  return <div className={classes.root}>{props.children}</div>;
};
