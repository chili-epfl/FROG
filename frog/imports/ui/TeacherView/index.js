// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { compose, withState } from 'recompose';
import { TimeSync } from 'meteor/mizzao:timesync';
import { withVisibility, msToString } from 'frog-utils';

import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import SkipNext from 'material-ui-icons/SkipNext';
import PlayArrow from 'material-ui-icons/PlayArrow';
import PowerSettingNew from 'material-ui-icons/PowerSettingsNew';
import Group from 'material-ui-icons/Group';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import PersonIcon from 'material-ui-icons/Person';
import AddIcon from 'material-ui-icons/Add';

import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import blue from 'material-ui/colors/blue';

// import Spinner from 'react-spinner';
import downloadLog from './downloadLog';
import StudentList from './StudentList';
// import StudentListModal from './StudentListModal';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';
import Dashboards from './Dashboard';

import { Activities } from '../../api/activities';
import { Graphs } from '../../api/graphs';

import {
  removeSession,
  updateSessionState,
  sessionStartCountDown,
  sessionCancelCountDown,
  sessionChangeCountDown,
  restartSession,
  Sessions
} from '../../api/sessions';
import { runSession, nextActivity } from '../../api/engine';
import { exportSession } from './exportComponent';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

// const CountdownDiv = styled.div`
//   border: solid 2px;
//   width: 65px;
//   text-align: center;
// `;

// const CountdownPure = ({ startTime, length, currentTime }) => {
//   const remainingTime = startTime + length - currentTime;
//   return (
//     <CountdownDiv>
//       {msToString(startTime > 0 ? remainingTime : length)}
//     </CountdownDiv>
//   );
// };

// const Countdown = createContainer(
//   props => ({ ...props, currentTime: TimeSync.serverTime() }),
//   CountdownPure
// );

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 0,
    margin: 0
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  button: {
    marginBottom: 16
  },
  statusTitle: {
    width: 250
  },
  emptyDiv: {
    width: 50
  },
  icon: {
    color: 'white'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

class SimpleDialog extends React.Component {
  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, students, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">Roster</DialogTitle>
        <DialogContent>
          <div>
            <List>
              {students.map(student => (
                <ListItem
                  button
                  onClick={() => this.handleListItemClick(student)}
                  key={student}
                >
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={student} />
                </ListItem>
              ))}
            </List>
            <Grid container styles={classes.root} justify="center" spacing={8}>
              <Grid item>
                <div className={classes.root}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="name-input">Name</InputLabel>
                    <Input id="name-input" />
                  </FormControl>
                  <Button
                    color="primary"
                    onClick={() => this.handleListItemClick('addAccount')}
                  >
                    <AddIcon />
                    add student
                  </Button>
                </div>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);

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

  handleSessionStatusChange = text => {
    this.sessionStatus = text;
  };

  render() {
    const { classes, session, buttons, visible, students } = this.props;

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
                        <Button
                          size="small"
                          color="primary"
                          onClick={this.handleClickOpen}
                          className={classes.button}
                        >
                          Roster
                          <Group className={classes.rightIcon} />
                        </Button>
                        <SimpleDialogWrapped
                          students={students}
                          open={this.state.open}
                          onClose={this.handleClose}
                        />
                      </Grid>
                    </Grid>
                    <GraphView session={session} />
                  </CardContent>
                  <CardActions style={{ textAlign: 'center' }}>
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
                            raised
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
                            raised
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
                            raised
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
                            raised
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
                            raised
                            style={{
                              backgroundColor: red[700],
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
                        <div className={classes.emptyDiv} />
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

const rawSessionController = ({
  session,
  visible,
  toggleVisibility,
  setShowStudentList,
  showStudentList,
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
      text: 'Restart session',
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
        {...props}
      />
    </div>
  );
};

const SessionController = compose(
  withVisibility,
  withState('showStudentList', 'setShowStudentList', false)
)(rawSessionController);

SessionController.displayName = 'SessionController';

const TeacherView = createContainer(
  () => {
    const user = Meteor.users.findOne(Meteor.userId());
    const session =
      user.profile && Sessions.findOne(user.profile.controlSession);
    const activities =
      session && Activities.find({ graphId: session.graphId }).fetch();
    const students =
      session && Meteor.users.find({ joinedSessions: session.slug }).fetch();

    return {
      sessions: Sessions.find().fetch(),
      session,
      graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
      activities,
      students,
      user
    };
  },
  props => (
    <div>
      <SessionController {...props} />
      {props.students && <StudentList students={props.students} />}
      <SessionList {...props} />
    </div>
  )
);

TeacherView.displayName = 'TeacherView';
export default TeacherView;
