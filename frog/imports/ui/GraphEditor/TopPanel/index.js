// @flow

import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import GraphMenu from './GraphMenu';

import { UndoButton, ConfigMenu } from './Settings';
import ExpandButton from '../SidePanel/ExpandButton';

const styles = {
  root: {
    flexGrow: 1
  }
};

const TopPanel = ({ classes }) => (
  <div id="topPanel">
    <Grid
      container
      className={classes.root}
      justify="space-between"
      spacing={24}
    >
      <Grid item>
        <Grid container className={classes.root}>
          <Grid item>
            <ConfigMenu />
          </Grid>
          <Grid item>
            <GraphMenu />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container className={classes.root}>
          <Grid item>
            <UndoButton />
          </Grid>
          <Grid item>
            <ExpandButton />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(TopPanel);
