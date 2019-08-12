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
    border: `1px ${grey[300]} solid`,
    marginRight: '-1px'
  }
}));

type StorybookContainerPropsT = {
  width?: number,
  height?: number,
<<<<<<< HEAD
  children: React.Node | React.Node[]
=======
  padding?: number,
  children: React.Element<*> | React.Element<*>[]
>>>>>>> cf54266f13f273a46fc131cb3072d9c9ba7bf8ce
};

export const StorybookContainer = (props: StorybookContainerPropsT) => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      {Array.isArray(props.children) ? (
        props.children.map(child => (
          <div
            className={classes.content}
            style={{
              width: props.width,
              height: props.height,
              padding: props.padding
            }}
          >
            {child}
          </div>
        ))
      ) : (
        <div
          className={classes.content}
          style={{
            width: props.width,
            height: props.height,
            padding: props.padding
          }}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};
