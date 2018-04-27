// @flow

import * as React from 'react';
import { withVisibility } from 'frog-utils';
import { compose, withState } from 'recompose';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import GraphView from './GraphView';
import DashboardNav from '../Dashboard/DashboardNav';
import SessionUtils from './SessionUtils';
import OrchestrationCtrlButtons from './OrchestrationCtrlButtons';
import styles from './styles';
import SettingsModal from './SettingsModal';

const OrchestrationViewController = ({
  session,
  token,
  visible,
  toggleVisibility,
  settingsOpen,
  setSettingsOpen,
  classes
}) => (
  <div>
    <div className={classes.root}>
      {session ? (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <SessionUtils
              session={session}
              token={token}
              openSettings={() => setSettingsOpen(true)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                {visible ? (
                  // when the graph is turned off
                  <React.Fragment>
                    <DashboardNav
                      session={session}
                      openActivities={session.openActivities}
                    />
                    <OrchestrationCtrlButtons session={session} />
                  </React.Fragment>
                ) : (
                  <Card>
                    <CardContent>
                      <GraphView session={session} />
                    </CardContent>
                  </Card>
                )}
              </Grid>
              <Grid item xs={12} className={classes.tempButtons}>
                <OrchestrationCtrlButtons
                  session={session}
                  toggle={toggleVisibility}
                  visible={visible}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <div>
          <Typography gutterBottom>
            Create a new session or choose a session from an existing one.
          </Typography>
        </div>
      )}
    </div>
    {settingsOpen && (
      <SettingsModal session={session} onClose={() => setSettingsOpen(false)} />
    )}
  </div>
);

const OrchestrationView = compose(
  withVisibility,
  withState('settingsOpen', 'setSettingsOpen', false),
  withStyles(styles)
)(OrchestrationViewController);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
