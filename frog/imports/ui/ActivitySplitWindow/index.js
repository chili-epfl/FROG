// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    overflow: 'auto',
    background: '#EEE'
  },
  rootWrap: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    flexWrap: 'wrap',
    overflow: 'auto',
    background: '#EEE',
    padding: theme.spacing(0.5)
  },
  rootGrid: {
    position: 'relative',
    display: 'grid',
    gridTemplateAreas: '"one two" "one three"',
    height: '100%',
    width: '100%',
    background: '#EEE',

    '& > div:nth-child(1)': {
      gridArea: 'one'
    },
    '& > div:nth-child(2)': {
      gridArea: 'two',
      marginBottom: '0',
      marginRight: theme.spacing(1)
    },
    '& > div:nth-child(3)': {
      gridArea: 'three'
    }
  },
  window: {
    flex: 1,
    background: '#FFF',
    margin: theme.spacing(1),
    marginRight: 0,
    '&:last-of-type': {
      marginRight: theme.spacing(1)
    },
    borderRadius: theme.spacing(0.5),
    overflow: 'auto'
  },
  smallWindow: {
    height: `calc(50% - ${theme.spacing(1)}px)`,
    width: `calc(50% - ${theme.spacing(1)}px)`,
    background: '#FFF',
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    overflow: 'auto'
  }
}));

type ActivitySplitWindowProps = {
  children?: React.Element<*>
};

export const ActivitySplitWindow = (props: ActivitySplitWindowProps) => {
  const classes = useStyle();

  const { children } = props;

  const split = children ? (children.length ? children.length : 1) : 0;

  return (
    <div
      className={
        split >= 4
          ? classes.rootWrap
          : split === 3
          ? classes.rootGrid
          : classes.root
      }
    >
      {split >= 4 &&
        children.map((child, index) => {
          return (
            <div className={classes.smallWindow} key={index}>
              {child}
            </div>
          );
        })}
      {split > 1 &&
        split < 4 &&
        children.map((child, index) => {
          return (
            <div className={classes.window} key={index}>
              {child}
            </div>
          );
        })}
      {split === 1 && <div className={classes.window}>{children}</div>}
      {split === 0 && <div className={classes.window} />}
    </div>
  );
};
