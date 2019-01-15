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
  image: {
    position: 'relative',
    border: 'none',
    background: 'none',
    maxWidth: '250px',
    height: '250px',
    width: '100%',
    margin: '5px',
    padding: '0px',
    flex: '0 1 auto'
  }
});

const ImageBox = ({
  children,
  onClick,
  classes
}: {
  onClick: Function,
  children: any,
  classes: any
}) => (
  <button onClick={onClick} className={classes.image}>
    <Paper elevation={4} className={classes.root}>
      {children}
    </Paper>
  </button>
);
ImageBox.displayName = 'ImageBox';
export default withStyles(styles)(ImageBox);
