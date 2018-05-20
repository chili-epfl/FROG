// @flow

import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import {
  ControlButton,
  OrchestrationButtonsModel
} from './utils/buttonUtils.js';

const styles = {
  textRight: {
    textAlign: 'right'
  },
  textLeft: {
    textAlign: 'left'
  },
  list: {
    listStyle: 'none'
  }
};

const OrchestrationCtrlButtons = ({ session, classes }) => {
  const buttonsModel = OrchestrationButtonsModel(session, classes);

  return (
    <Grid container>
      <Grid item xs={6} className={classes.textRight}>
        <ControlButton
          btnModel={
            session.timeInGraph === -1 ? buttonsModel.start : buttonsModel.next
          }
        />
      </Grid>
      <Grid item xs={6} className={classes.textLeft}>
        <ul className={classes.list}>
          {(session.nextActivities || []).map(x => (
            <li key={x.activityId}>{x.description}</li>
          ))}
        </ul>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(OrchestrationCtrlButtons);
