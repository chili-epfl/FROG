// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: '1024px',
    margin: '0 auto',

    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '64px'
  },
  left: {
    position: 'relative'
  }
}));

type SplitLayoutPropsT = {
  left?: React.Element<*>,
  right?: React.Element<*>,
  rightPanelSize?: string
};

export const SplitLayout = (props: SplitLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div
      className={classes.root}
      style={{ gridTemplateColumns: `1fr ${props.rightPanelSize || '1fr'}` }}
    >
      <div className={classes.left}>{props.left}</div>
      <div className={classes.right}>{props.right}</div>
    </div>
  );
};
