// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '48px 1fr 250px',
    gridTemplateColumns: '250px 1fr',
    background: 'white'
  },
  rootWithoutExtra: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '48px 1fr',
    gridTemplateColumns: '250px 1fr',
    background: 'white'
  },
  sidebar: {
    gridColumn: 1,
    gridRow: '1 / 3',
    borderRight: '1px solid #EAEAEA',
    position: 'relative'
  },
  contentTopBar: {
    gridColumn: 2,
    gridRow: 1,
    position: 'relative',
    overflow: 'auto'
  },
  content: {
    gridColumn: 2,
    gridRow: 2,
    position: 'relative',
    overflow: 'auto'
  },
  extra: {
    gridColumn: 2,
    gridRow: 3,
    borderTop: '1px solid #EAEAEA',
    overflow: 'auto'
  }
}));

type SidebarLayoutPropsT = {
  sidebar?: React.Element<*>,
  content?: React.Element<*>,
  contentTopBar?: React.Element<*>,
  extra?: React.Element<*>
};

export const SidebarLayout = (props: SidebarLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={`${props.extra ? classes.root : classes.rootWithoutExtra}`}>
      <div className={classes.sidebar}>{props.sidebar}</div>
      <div className={classes.contentTopBar}>{props.contentTopBar}</div>
      <div className={classes.content}>{props.content}</div>
      {props.extra ? <div className={classes.extra}>{props.extra}</div> : null}
    </div>
  );
};
