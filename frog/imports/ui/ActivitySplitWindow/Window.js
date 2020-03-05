// @flow

import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    flex: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    background: '#DDD',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    fontWeight: '700'
  },
  content: {
    flex: 1,
    overflow: 'hidden'
  }
}));

type ActivityWindowProps = {
  children?: React.Element<*>,
  title?: string
};

export const ActivityWindow = (props: ActivityWindowProps) => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      {props.title && (
        <div className={classes.title}>
          <Typography variant="subtitle2">{props.title}</Typography>
        </div>
      )}
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};
