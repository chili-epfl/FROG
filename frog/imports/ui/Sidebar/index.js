// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: '250px',
    height: '100%',
    background: 'white',

    display: 'flex',
    flexFlow: 'column nowrap',

    borderRight: '1px solid #EAEAEA',

    userSelect: 'none'
  },
  content: {
    flexGrow: 1
  }
}));

type SidebarPropsT = {
  header?: React.Node,
  children?: React.Node[],
  footer?: React.Node
};

/**
 * The base component for a sidebar in FROG. Is composed of a number of panels.
 */
export const Sidebar = (props: SidebarPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      {props.header && <div>{props.header}</div>}
      {props.children && (
        <div className={classes.content}>{props.children}</div>
      )}
      {props.footer && <div>{props.footer}</div>}
    </div>
  );
};
