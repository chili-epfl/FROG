// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 250px',
    gridTemplateColumns: '250px 1fr',
    background: 'white'
  },
  sidebar: {
    gridColumn: 1,
    gridRow: '1 / 3',
    borderRight: '1px solid #EAEAEA',
    position: 'relative'
  },
  content: {
    gridColumn: 2,
    gridRow: 1,
    position: 'relative'
  },
  extra: {
    gridColumn: 2,
    gridRow: 2,
    borderTop: '1px solid #EAEAEA'
  }
}));

type SidebarLayoutPropsT = {
  sidebar?: React.Element<*>,
  content?: React.Element<*>,
  extra?: React.Element<*>
};

export const SidebarLayout = (props: SidebarLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>{props.sidebar}</div>
      <div className={classes.content}>{props.content}</div>
      <div className={classes.extra}>{props.extra}</div>
    </div>
  );
};
