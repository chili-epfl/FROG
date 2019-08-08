// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '250px 1fr',
    background: 'white'
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
      <div>{props.sidebar}</div>
      <div>{props.content}</div>
    </div>
  );
};
