// @flow

import React from 'react';
import Grid from 'material-ui/Grid';

import GraphList from './GraphList';
import GraphConfigPanel from './GraphConfigPanel';
import { UndoButton, ConfigMenu } from './Settings';

const styles = {
  root: {
    flexGrow: 1
  }
};

export default () => (
  <div id="topPanel">
    <Grid container styles={styles.root} justify="space-between" spacing={24}>
      <Grid item>
        <Grid container styles={styles.root} spacing={3}>
          <Grid item>
            <ConfigMenu />
          </Grid>
          <Grid item>
            <GraphList />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {/*<GraphConfigPanel />*/}
      </Grid>
      <Grid item>
        <UndoButton />
      </Grid>
    </Grid>
  </div>
);
