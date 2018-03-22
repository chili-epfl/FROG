import * as React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import { withVisibility, msToString } from 'frog-utils';

import {
  ControlButton,
  OrchestrationButtonsModel
} from './Utils/buttonUtils.js';

import styles from './styles';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const OrchestrationCtrlButtons = ({
  session,
  toggle,
  toggleVisibility,
  classes
}) => {
  const buttonsModel = OrchestrationButtonsModel(session, classes);

  return (
    <Grid
      container
      spacing={8}
      alignItems="center"
      direction="row"
      justify="space-between"
    >
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
