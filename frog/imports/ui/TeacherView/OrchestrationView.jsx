import * as React from 'react';
import { withVisibility, msToString } from 'frog-utils';
import { compose, withState } from 'recompose';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import GraphView from './GraphView';
import Dashboards from './Dashboard';
import SessionUtils from './SessionUtils';
import SessionInfo from './SessionInfo';
import OrchestrationCtrlButtons from './OrchestrationCtrlButtons';
import styles from './styles';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const OrchestrationViewController = ({
  session,
  visible,
  toggleVisibility,
  classes
}) => (
  <div>
    <div className={classes.root}>
      {session ? (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <SessionUtils session={session} toggle={toggleVisibility} />
          </Grid>
          {visible ? (
            // when the graph is turned off
            <Dashboards
              session={session}
              openActivities={session.openActivities}
            />
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <SessionInfo session={session} />
                  <GraphView session={session} />
                </CardContent>
                <CardActions>
                  <OrchestrationCtrlButtons session={session} />
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <div>
          <Typography gutterBottom>
            Create a new session or choose a session from an existing one.
          </Typography>
        </div>
      )}
    </div>
  </div>
);

const OrchestrationView = compose(withVisibility, withStyles(styles))(
  OrchestrationViewController
);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
