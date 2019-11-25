// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'auto'
  },
  rootWithTitle: {
    display: 'grid',
    gridTemplateRows: `${theme.spacing(4)}px 1fr`
  },
  title: {
    width: '100%',
    position: 'relative',
    top: '0px',
    left: '0px',
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    background: '#DDD',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    fontWeight: '500'
  }
}));

type ActivityWindowProps = {
  children?: React.Element<*>,
  title?: String
};

export const ActivityWindow = (props: ActivityWindowProps) => {
  const classes = useStyle();

  return (
    <div className={`${classes.root} ${props.title && classes.rootWithTitle}`}>
      {props.title && (
        <div className={classes.title}>
          <Typography variant="subtitle2">{props.title}</Typography>
        </div>
      )}
      {props.children}
    </div>
  );
};
