// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    overflow: 'auto',
    background: '#EEE',
    padding: theme.spacing(0.5)
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
    gridTemplateColumns: '50% 50%',
    gridTemplateRows: '50% 50%',
    height: '100%',
    width: '100%',
    background: '#EEE',
    padding: theme.spacing(0.5),

    '& > div:nth-child(1)': {
      gridArea: 'one'
    },
    '& > div:nth-child(2)': {
      gridArea: 'two'
    },
    '& > div:nth-child(3)': {
      gridArea: 'three'
    }
  },
  window: {
    flex: 1,
    background: '#FFF',
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    overflow: 'hidden',
    boxShadow: '0px 1px 3px rgba(0,0,0,.5)'
  },
  smallWindow: {
    height: `calc(50% - ${theme.spacing(1)}px)`,
    width: `calc(50% - ${theme.spacing(1)}px)`,
    background: '#FFF',
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    overflow: 'hidden',
    boxShadow: '0px 1px 3px rgba(0,0,0,.5)'
  }
}));

type ActivitySplitWindowProps = {
  children: React.Element<*>[]
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
