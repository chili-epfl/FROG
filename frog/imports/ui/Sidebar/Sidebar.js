// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
  },
  footer: {
    borderTop: '1px solid #EAEAEA'
  }
}));

type SidebarPropsT = {
  header?: React.Element<*>,
  children?: React.Element<*>[],
  footer?: React.Element<*>
};

/**
 * The base component for a sidebar in FROG.
 */
export const Sidebar = (props: SidebarPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      {props.header && <div className={classes.header}>{props.header}</div>}
      {props.children && (
        <div className={classes.content}>{props.children}</div>
      )}
      {props.footer && <div className={classes.footer}>{props.footer}</div>}
    </div>
  );
};
