// @flow

import * as React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(() => ({
  root: {
    pointerEvents: 'none'
  }
}));

type ProgressPropsT = {
  size?: 'small' | 'default' | 'large'
};

export const Progress = (props: ProgressPropsT) => {
  const classes = useStyle();

  let size = 32;
  switch (props.size) {
    case 'small':
      size = 16;
      break;
    case 'default':
      size = 32;
      break;
    case 'large':
      size = 48;
      break;
    default:
      size = 32;
      break;
  }
  return (
    <CircularProgress className={classes.root} color="inherit" size={size} />
  );
};
