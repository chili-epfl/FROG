import * as React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import {
  ControlButton,
  OrchestrationButtonsModel
} from './Utils/buttonUtils.js';

import styles from './styles';

const OrchestrationCtrlButtons = ({ session, classes }) => {
  const buttonsModel = OrchestrationButtonsModel(session, classes);

  return (
    <Grid container justify="space-between">
      <Grid item>
        <ControlButton btnModel={buttonsModel.start} classes={classes} />
      </Grid>
      <Grid item>
        <ControlButton btnModel={buttonsModel.stop} classes={classes} />
        <ControlButton btnModel={buttonsModel.continue} classes={classes} />
        <ControlButton btnModel={buttonsModel.pause} classes={classes} />
        <ControlButton btnModel={buttonsModel.next} classes={classes} />
      </Grid>
      <Grid item>
        <ControlButton btnModel={buttonsModel.restart} classes={classes} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(OrchestrationCtrlButtons);
