// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '48px 1fr 250px',
    gridTemplateColumns: '250px 1fr'
  },
  rootWithoutGraph: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '48px 1fr',
    gridTemplateColumns: '250px 1fr'
  },
  header: {
    gridColumn: '1 / 3',
    gridRow: 1,
    borderBottom: '1px solid #EAEAEA'
  },
  sidebar: {
    gridColumn: 1,
    gridRow: '2 / 4',
    borderRight: '1px solid #EAEAEA'
  },
  content: {
    gridColumn: 2,
    gridRow: 2,
    overflow: 'auto'
  },
  extra: {
    gridColumn: 2,
    gridRow: 3,
    borderTop: '1px solid #EAEAEA',
    overflow: 'auto'
  }
}));

type PopupLayoutPropsT = {
  header?: React.Element<*>,
  sidebar?: React.Element<*>,
  content?: React.Element<*>,
  extra?: ?React.Element<*>
};

export const PopupLayout = (props: PopupLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={props.extra ? classes.root : classes.rootWithoutGraph}>
      <div className={classes.header}>{props.header}</div>
      <div className={classes.sidebar}>{props.sidebar}</div>
      <div className={classes.content}>{props.content}</div>
      {props.extra ? <div className={classes.extra}>{props.extra}</div> : null}
    </div>
  );
};
