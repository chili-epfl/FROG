// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    height: '100%',
    width: '100%',
    padding: '20px',
    overflow: 'auto'
  },
  imageSmall: {
    position: 'relative',
    border: 'none',
    background: 'none',
    maxWidth: '250px',
    width: '100%',
    margin: '5px',
    padding: '0px',
    flex: '0 1 auto',
    maxHeight: '250px',
    verticalAlign: 'top'
  },
  image: {
    position: 'relative',
    border: 'none',
    background: 'none',
    maxWidth: '250px',
    width: '100%',
    margin: '5px',
    padding: '0px',
    flex: '0 1 auto',
    verticalAlign: 'top'
  }
});

const ImageBox = ({
  children,
  onClick,
  classes,
  expand
}: {
  onClick: Function,
  children: any,
  classes: any,
  expand?: boolean
}) => (
  <button
    onClick={onClick}
    className={expand ? classes.image : classes.imageSmall}
  >
    <Paper elevation={4} className={classes.root}>
      {children}
    </Paper>
  </button>
);
ImageBox.displayName = 'ImageBox';
export default withStyles(styles)(ImageBox);
