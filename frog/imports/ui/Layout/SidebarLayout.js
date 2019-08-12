// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '250px 1fr',
    background: 'white'
  },
  sidebar: {
    borderRight: '1px solid #EAEAEA',
    position: 'relative',
  },
  content: {
    position: 'relative',
  }
}));

type SidebarLayoutPropsT = {
  sidebar?: React.Element<*>,
  content?: React.Element<*>
};

/**
 * TopBar provides UI knobs to show navigation and important actions
 */
export const SidebarLayout = (props: SidebarLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>{props.sidebar}</div>
      <div className={classes.content}>{props.content}</div>
    </div>
  );
};
