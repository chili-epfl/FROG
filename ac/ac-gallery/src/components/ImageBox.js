// @flow

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    marginLeft: 20,
    paddingLeft: 16,
    paddingRight: 24,
    paddingTop: 20,
    paddingBottom: 16
  }
});

const ImageBox = ({
  children,
  onClick,
  classes,
  color
}: {
  onClick: Function,
  children: any,
  classes: any,
  color?: string
}) => (
  <Paper
    onClick={onClick}
    elevation={12}
    className={classes.root}
    style={{ backgroundColor: color }}
  >
    {children}
  </Paper>
);
// style={getStyle(styleCode)}
ImageBox.displayName = 'ImageBox';
export default withStyles(styles)(ImageBox);
