// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    minHeight: '100%',

    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '128px 1fr 64px'
  },
  border: {
    position: 'relative'
  },
  innerBorder: {
    position: 'fixed',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center'
  },
  children: {
    padding: theme.spacing(8, 2)
  }
}));

type BaseLayoutPropsT = {
  left?: React.Element<*> | React.Element<*>[],
  children?: React.Element<*> | React.Element<*>[],
  right?: React.Element<*> | React.Element<*>[]
};

export const BaseLayout = (props: BaseLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.border}>
        <div className={classes.innerBorder}>{props.left}</div>
      </div>
      <div className={classes.children}>{props.children}</div>
      <div className={classes.border}>
        <div className={classes.innerBorder}>{props.right}</div>
      </div>
    </div>
  );
};
