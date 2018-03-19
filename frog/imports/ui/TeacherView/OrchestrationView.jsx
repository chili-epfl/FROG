import * as React from 'react';
import { withVisibility, msToString } from 'frog-utils';
import { TimeSync } from 'meteor/mizzao:timesync';
import { compose, withState } from 'recompose';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import SkipNext from 'material-ui-icons/SkipNext';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Refresh from 'material-ui-icons/Refresh';
import PowerSettingNew from 'material-ui-icons/PowerSettingsNew';
import Group from 'material-ui-icons/Group';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';

import {
  removeSession,
  updateSessionState,
  sessionStartCountDown,
  sessionCancelCountDown,
  sessionChangeCountDown,
  restartSession
} from '../../api/sessions';
import downloadLog from './downloadLog';
import { runSession, nextActivity } from '../../api/engine';
import { exportSession } from './exportComponent';
import SettingsModal from './SettingsModal';
import GraphView from './GraphView';
import Dashboards from './Dashboard';
import ButtonList from './ButtonList';
import styles from './styles';
import Roster from './Roster';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

@withStyles(styles)
export class SessionMainContainer extends React.Component {
  sessionStatus = 'Stopped';

  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSessionStatusChange = (text: string) => {
    this.sessionStatus = text;
  };

  render() {
    const {
      classes,
      session,
      buttons,
      visible,
      students,
      setShowSettings,
      showSettings
    } = this.props;

    const restartButton = buttons.filter(
      button => button.text === 'Restart'
    )[0];
    const stopButton = buttons.filter(button => button.text === 'Stop')[0];
    const startButton = buttons.filter(button => button.text === 'Start')[0];
    const pauseButton = buttons.filter(button => button.text === 'Pause')[0];
    const continueButton = buttons.filter(
      button => button.text === 'Continue'
    )[0];
    const nextActivityButton = buttons.filter(
      button => button.text === 'Next Activity'
    )[0];

    this.sessionStatus =
      session && session.state ? session.state.toLowerCase() : 'stopped';

    return (
      <div className={classes.root}>
        {showSettings && (
          <SettingsModal
            dismiss={() => setShowSettings(false)}
            session={session}
          />
        )}
        {session ? (
          <Grid id="main-container" container spacing={0}>
            <Grid id="button-list" item xs={12}>
              <ButtonList session={session} buttons={buttons} />
            </Grid>
            {visible ? (
              // when the graph is turned off
              <Dashboards
                session={session}
                openActivities={session.openActivities}
              />
            ) : (
              <Grid id="graph-session" item xs={12}>
                <Card>
                  <CardContent>
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
                            Session Graph ({this.sessionStatus})
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          id="tooltip-top"
                          title="edit the roster list for this session"
                          placement="top"
                        >
                          <Button
                            size="small"
                            color="primary"
                            onClick={this.handleClickOpen}
                            className={classes.button}
                          >
                            Roster
                            <Group className={classes.rightIcon} />
                          </Button>
                        </Tooltip>
                        <Roster
                          students={students}
                          open={this.state.open}
                          onClose={this.handleClose}
                          session={session}
                          {...this.props}
                        />
                      </Grid>
                    </Grid>
                    <GraphView session={session} />
                  </CardContent>
                  <CardActions>
                    <Grid
                      container
                      spacing={8}
                      alignItems="center"
                      direction="row"
                      justify="space-between"
                    >
                      <Grid item>
                        <Tooltip
                          id="tooltip-top"
                          title="start the current session"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: blue[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={() => {
                              startButton.onClick();
                              this.handleSessionStatusChange('Running');
                            }}
                            id={startButton.text}
                          >
                            <PowerSettingNew className={classes.icon} />
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          id="tooltip-top"
                          title="stop the current session"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: red[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={() => {
                              stopButton.onClick();
                              this.handleSessionStatusChange(
                                stopButton.text.toLowerCase()
                              );
                            }}
                            id={stopButton.text}
                          >
                            <Stop className={classes.icon} />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="continue the session"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: green[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={() => {
                              continueButton.onClick();
                              this.handleSessionStatusChange(
                                continueButton.text.toLowerCase()
                              );
                            }}
                            id={continueButton.text}
                          >
                            <PlayArrow className={classes.icon} />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="pause the current session"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: red[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={() => {
                              pauseButton.onClick();
                              this.handleSessionStatusChange(
                                pauseButton.text.toLowerCase()
                              );
                            }}
                            id={pauseButton.text}
                          >
                            <Pause className={classes.icon} />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          id="tooltip-top"
                          title="jump to the next activity"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: blue[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={nextActivityButton.onClick}
                            id={nextActivityButton.text}
                          >
                            <SkipNext className={classes.icon} />
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          id="tooltip-top"
                          title="restart the session"
                          placement="top"
                        >
                          <Button
                            variant="raised"
                            style={{
                              backgroundColor: red[700],
                              minWidth: 15,
                              margin: 3
                            }}
                            onClick={restartButton.onClick}
                            id={restartButton.text}
                          >
                            <Refresh className={classes.icon} />
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            )}
          </Grid>
        ) : (
          <div>
            <Typography type="body1" gutterBottom>
              Create a new session or choose a session from an existing one.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

const OrchestrationViewController = ({
  session,
  visible,
  toggleVisibility,
  setShowStudentList,
  showStudentList,
  setShowSettings,
  showSettings,
  ...props
}) => {
  const buttons = [
    {
      states: ['CREATED'],
      type: 'primary',
      onClick: () => {
        runSession(session._id);
        nextActivity(session._id);
      },
      text: 'Start',
      source: 'toolbar'
    },
    {
      states: ['STARTED'],
      type: 'primary',
      onClick: () => nextActivity(session._id),
      text: 'Next Activity',
      source: 'toolbar'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'primary',
      onClick: toggleVisibility,
      text: 'Toggle dashboard/graph view',
      source: 'menu'
    },
    {
      states: ['STARTED'],
      type: 'warning',
      onClick: () =>
        updateSessionState(session._id, 'PAUSED', TimeSync.serverTime()),
      text: 'Pause',
      source: 'toolbar'
    },
    {
      states: ['PAUSED', 'STOPPED'],
      type: 'primary',
      onClick: () =>
        updateSessionState(session._id, 'STARTED', TimeSync.serverTime()),
      text: 'Continue',
      source: 'toolbar'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => updateSessionState(session._id, 'STOPPED'),
      text: 'Stop',
      source: 'toolbar'
    },
    {
      states: ['STOPPED'],
      type: 'danger',
      onClick: () => removeSession(session._id),
      text: 'Delete',
      source: 'toolbar'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => setShowStudentList(true),
      text: 'Edit student list',
      source: 'toolbar'
    },
    {
      states: ['CREATED', 'STARTED', 'PAUSED'],
      type: 'primary',
      onClick: () => restartSession(session),
      text: 'Restart',
      source: 'toolbar'
    },
    {
      states: ['STARTED'],
      countdownStarted: false,
      type: 'primary',
      onClick: () => sessionStartCountDown(session._id, TimeSync.serverTime()),
      text: 'Start Countdown',
      source: 'toolbar'
    },
    {
      states: ['STARTED', 'PAUSED'],
      countdownStarted: true,
      type: 'danger',
      onClick: () => sessionCancelCountDown(session._id),
      text: 'Cancel Countdown',
      source: 'toolbar'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'success',
      onClick: () =>
        sessionChangeCountDown(
          session._id,
          DEFAULT_COUNTDOWN_LENGTH,
          TimeSync.serverTime()
        ),
      text: '+' + msToString(DEFAULT_COUNTDOWN_LENGTH),
      source: 'toolbar'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => {
        if (session.countdownLength > DEFAULT_COUNTDOWN_LENGTH) {
          sessionChangeCountDown(
            session._id,
            0 - DEFAULT_COUNTDOWN_LENGTH,
            TimeSync.serverTime()
          );
        }
      },
      text: '-' + msToString(DEFAULT_COUNTDOWN_LENGTH),
      source: 'toolbar'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => downloadLog(session._id),
      text: 'Download log csv',
      source: 'menu'
    },
    {
      states: ['STARTED', 'PAUSED'],
      type: 'danger',
      onClick: () => exportSession(session._id),
      text: 'Export session',
      source: 'menu'
    }
  ];
  return (
    <div>
      <SessionMainContainer
        buttons={buttons}
        session={session}
        visible={visible}
        toggleVisibility={toggleVisibility}
        setShowStudentList={setShowStudentList}
        showStudentList={showStudentList}
        setShowSettings={setShowSettings}
        showSettings={showSettings}
        {...props}
      />
    </div>
  );
};

const OrchestrationView = compose(
  withVisibility,
  withState('showSettings', 'setShowSettings', false)
)(OrchestrationViewController);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
