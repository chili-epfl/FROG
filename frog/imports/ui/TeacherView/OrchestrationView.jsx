// @flow

import * as React from 'react';
import { withVisibility } from 'frog-utils';
import { compose, withState } from 'recompose';

import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';

import GraphView from './GraphView';
import DashboardNav from '../Dashboard/DashboardNav';
import SessionUtils from './SessionUtils';
import OrchestrationCtrlButtons from './OrchestrationCtrlButtons';
import SettingsModal from './SettingsModal';

const styles = {
  root: {
    marginTop: '48px'
  },
  subroot: {
    height: 'calc(100vh - 106px)',
    padding: '10px 0'
  },
  buttonsToBottom: {
    alignSelf: 'flex-end'
  }
};

const OrchestrationViewController = ({
  session,
  token,
  visible,
  toggleVisibility,
  settingsOpen,
  setSettingsOpen,
  classes
}) => (
  <React.Fragment>
    {session && (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <SessionUtils
            session={session}
            toggle={toggleVisibility}
            visible={visible}
            token={token}
            openSettings={() => setSettingsOpen(true)}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container className={classes.subroot}>
            <Grid item xs={12}>
              {visible ? (
                // when the graph is turned off
                <DashboardNav
                  session={session}
                  openActivities={session.openActivities}
                />
              ) : (
                <Card>
                  <CardContent>
                    <GraphView session={session} />
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} className={classes.buttonsToBottom}>
              <OrchestrationCtrlButtons session={session} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )}

    {settingsOpen && (
      <SettingsModal session={session} onClose={() => setSettingsOpen(false)} />
    )}
  </React.Fragment>
);

const OrchestrationView = compose(
  withVisibility,
  withState('settingsOpen', 'setSettingsOpen', false),
  withStyles(styles)
)(OrchestrationViewController);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
