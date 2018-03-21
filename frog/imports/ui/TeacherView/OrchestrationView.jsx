import * as React from 'react';
import { withVisibility, msToString } from 'frog-utils';
import { compose, withState } from 'recompose';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import SettingsModal from './SettingsModal';
import GraphView from './GraphView';
import Dashboards from './Dashboard';
import SessionActions from './SessionActions';
import SessionInfo from './SessionInfo';
import ButtonList from './ButtonList';
import styles from './styles';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const OrchestrationViewController = ({
  session,
  visible,
  toggleVisibility,
  setShowStudentList,
  showStudentList,
  setShowSettings,
  showSettings,
  classes
}) => {
  let sessionStatus = 'Stopped';

  handleSessionStatusChange = (text: string) => {
    sessionStatus = text;
  };

  sessionStatus =
    session && session.state ? session.state.toLowerCase() : 'stopped';

  return (
    <div>
      <div className={classes.root}>
        {showSettings && (
          <SettingsModal
            dismiss={() => setShowSettings(false)}
            session={session}
          />
        )}
        {session ? (
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <SessionActions session={session} />
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
                    {/* <SessionInfo
                      {...this.props}
                      sessionStatus={sessionStatus}
                    /> */}
                    <GraphView session={session} />
                  </CardContent>
                  <CardActions>
                    <ButtonList session={session} />
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
};

const OrchestrationView = compose(
  withVisibility,
  withStyles(styles),
  withState('showSettings', 'setShowSettings', false)
)(OrchestrationViewController);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
