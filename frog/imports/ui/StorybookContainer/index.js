// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: grey[100]
  },
  content: {
    background: 'white',
    border: `1px ${grey[300]} solid`
  }
}));

type StorybookContainerPropsT = {
  width: number,
  height: number,
  children: React.Node | React.Node[]
};

export const StorybookContainer = (props: StorybookContainerPropsT) => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <div
        className={classes.content}
        style={{ width: props.width, height: props.height }}
      >
        {props.children}
      </div>
    </div>
  );
};
