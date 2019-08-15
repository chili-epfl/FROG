// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
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
  right?: React.Element<*>,
  size?: number
};

export const SplitLayout = (props: SplitLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div
      className={classes.root}
      style={{ gridTemplateColumns: `${props.size || 1}fr 1fr` }}
    >
      <div className={classes.left}>{props.left}</div>
      <div className={classes.right}>{props.right}</div>
    </div>
  );
};
