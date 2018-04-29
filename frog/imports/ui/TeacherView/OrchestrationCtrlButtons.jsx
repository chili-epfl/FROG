// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import {
  ControlButton,
  OrchestrationButtonsModel
} from './utils/buttonUtils.js';

import styles from './styles';

const OrchestrationCtrlButtons = ({ session, classes }) => {
  const buttonsModel = OrchestrationButtonsModel(session, classes);

  return (
    <Grid
      container
      spacing={16}
      alignItems="flex-end"
      justify="space-between"
      className={classes.buttonBar}
    >
      <Grid item />
      <Grid item xs={9}>
        <Grid justify="center" container alignItems="flex-end">
          <Grid item xs={3} />
          <Grid item>
            <ControlButton
              btnModel={buttonsModel.next}
              classes={classes}
              style={{ transform: 'scale(1.5)' }}
            />
          </Grid>
          <Grid item xs={5}>
            <ul style={{ listStyleType: 'none' }}>
              {(session.nextActivities || []).map(x => (
                <li key={x.activityId}>{x.description}</li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Grid>
      <Grid item />
    </Grid>
  );
};

export default withStyles(styles)(OrchestrationCtrlButtons);
