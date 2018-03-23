// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import SettingsModel from './SettingsModal';

import styles from './styles';

const SessionInfo = ({ classes, session }) => {
  const sessionState =
    session && session.state ? session.state.toLowerCase() : 'stopped';

  return (
    <Grid
      container
      spacing={24}
      alignItems="center"
      direction="row"
      justify="space-between"
    >
      <Grid item>
        <div className={classes.statusTitle}>
          <Typography type="title" className={classes.title}>
            Session Graph ({sessionState})
          </Typography>
        </div>
      </Grid>
      <Grid item>
        <SettingsModel session={session} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(SessionInfo);
