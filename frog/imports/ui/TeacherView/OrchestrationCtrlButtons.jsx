// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import {
  ControlButton,
  OrchestrationButtonsModel,
  DashToggle
} from './utils/buttonUtils.js';

import styles from './styles';

const OrchestrationCtrlButtons = ({ session, classes, visible, toggle }) => {
  const buttonsModel = OrchestrationButtonsModel(session, classes);

  return (
    <Grid container spacing={0} justify="center">
      <Grid item xs={12}>
        <DashToggle
          visible={visible}
          toggleVisible={toggle}
          classes={classes}
        />
        <ControlButton btnModel={buttonsModel.next} classes={classes} />
        {/* <ul style={{ listStyleType: 'none' }}>
          {(session.nextActivities || []).map(x => <li key={x}>{x}</li>)}
        </ul> */}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(OrchestrationCtrlButtons);
