// @flow
import * as React from 'react';

import { withStyles } from '@material-ui/styles';

const styles = () => ({
  topLeft: {
    position: 'absolute',
    backgroundColor: '#e7ffac',
    top: 0,
    left: 0,
    height: '50%',
    width: '50%'
  },
  topRight: {
    position: 'absolute',
    backgroundColor: '#fbe4ff',
    top: 0,
    left: '50%',
    height: '50%',
    width: '50%'
  },
  bottomLeft: {
    position: 'absolute',
    backgroundColor: '#dcd3ff',
    top: '50%',
    left: 0,
    height: '50%',
    width: '50%'
  },
  bottomRight: {
    position: 'absolute',
    backgroundColor: '#ffccf9',
    top: '50%',
    left: '50%',
    height: '50%',
    width: '50%'
  }
});

const Quadrants = ({
  config,
  classes
}: {
  config: Object,
  classes: Object
}) => (
  <div className={classes.container}>
    <div className={classes.topLeft}>{config.board?.quadrant1}</div>
    <div className={classes.topRight}>{config.board?.quadrant2}</div>
    <div className={classes.bottomLeft}>{config.board?.quadrant3}</div>
    <div className={classes.bottomRight}>{config.board?.quadrant4}</div>
  </div>
);

export default withStyles(styles)(Quadrants);
