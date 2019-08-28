// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import { TopBar } from '/imports/ui/TopBar';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100
  }
}));

type PreviewViewPropsT = {
  overlays?: React.Element<*>,
  children: React.Element<*> | React.Element<*>[]
};

export const PreviewView = (props: PreviewViewPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={classes.overlay}>
        <TopBar
          actions={props.overlays}
          variant="minimal"
          color="transparent"
        />
      </div>
      {props.children}
    </div>
  );
};
