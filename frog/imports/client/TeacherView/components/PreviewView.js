// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    background: '#EAEAEA',
    padding: theme.spacing(2)
  },
  content: {
    width: '100%',
    height: '100%',
    borderRadius: theme.shape.borderRadius,
    background: 'white',
    overflow: 'hidden'
  }
}));

type PreviewViewPropsT = {
  children: React.Element<*> | React.Element<*>[]
};

export const PreviewView = (props: PreviewViewPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};
