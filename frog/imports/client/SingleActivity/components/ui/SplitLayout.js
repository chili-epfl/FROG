// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '64px'
  }
}));

type SplitLayoutPropsT = {
  left?: React.Element<*>,
  right?: React.Element<*>
};

export const SplitLayout = (props: SplitLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.left}>{props.left}</div>
      <div className={classes.right}>{props.right}</div>
    </div>
  );
};
