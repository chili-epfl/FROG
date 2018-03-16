// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose, withState } from 'recompose';
import { TimeSync } from 'meteor/mizzao:timesync';
import { withVisibility, msToString } from 'frog-utils';

import SettingsModal from './SettingsModal';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import SkipNext from 'material-ui-icons/SkipNext';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Refresh from 'material-ui-icons/Refresh';
import PowerSettingNew from 'material-ui-icons/PowerSettingsNew';
import Group from 'material-ui-icons/Group';
import Avatar from 'material-ui/Avatar';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import PersonIcon from 'material-ui-icons/Person';
import AddIcon from 'material-ui-icons/Add';
import Delete from 'material-ui-icons/Delete';

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
import { Sessions } from '../../api/sessions';
import { GlobalSettings } from '../../api/globalSettings';

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

@withStyles(styles)
class SimpleDialog extends React.Component<
  {
    classes: any,
    session: Object,
    onClose: Function,
    open: boolean,
    students: Array<Object>
  },
  { studentName: string }
> {
  studentlist = [];
  state = {
    studentName: ''
  };

  constructor(props) {
    super(props);
    const { session } = this.props;
    this.studentlist = session.studentlist ? session.studentlist : [];
  }

  handleChange = (event: Object) => {
    this.setState({ studentName: String(event.target.value) });
  };
  handleAddStudent = () => {
    const { session } = this.props;

    if (this.state.studentName !== undefined && this.state.studentName !== '') {
      this.studentlist.push(this.state.studentName);
      Sessions.update(session._id, {
        $set: {
          studentlist: this.studentlist
        }
      });
    }
  };

  handleDeleteStudent = (student: string) => {
    const { session } = this.props;
    if (student !== undefined) {
      const index = this.studentlist.indexOf(student);
      if (index > -1) {
        this.studentlist.splice(index, 1);
        Sessions.update(session._id, {
          $set: {
            studentlist: this.studentlist
          }
        });
      }
    }
  };

  render() {
    const { classes, onClose, session, ...other } = this.props;
    return (
      <Dialog
        onClose={onClose}
        aria-labelledby="simple-dialog-title"
        {...other}
      >
        <DialogTitle id="simple-dialog-title">Roster</DialogTitle>
        <DialogContent>
          <div>
            <List>
              {session.studentlist ? (
                session.studentlist.map(student => (
                  <ListItem
                    button
                    key={student}
                    // onClick={() => this.handleListItemClick(student)}
                  >
                    <ListItemAvatar>
                      <Avatar className={classes.avatar}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={student} />
                    <ListItemSecondaryAction>
                      <IconButton
                        aria-label="Delete"
                        id={student}
                        onClick={() => this.handleDeleteStudent(student)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem key="none">
                  <ListItemText primary="no students" />
                </ListItem>
              )}
            </List>
            <Grid
              container
              className={classes.root}
              justify="center"
              spacing={8}
            >
              <Grid item>
                <div className={classes.root}>
                  <FormControl
                    className={classes.formControl}
                    aria-describedby="name-helper-text"
                  >
                    <InputLabel htmlFor="name-helper">Name</InputLabel>
                    <Input
                      id="name-helper"
                      value={this.state.studentName}
                      onChange={this.handleChange}
                    />
                    <FormHelperText id="name-helper-text">
                      Add a student to the current session
                    </FormHelperText>
                  </FormControl>
                  <IconButton
                    className={classes.button}
                    color="default"
                    size="small"
                    onClick={this.handleAddStudent}
                  >
                    <AddIcon className={classes.leftIcon} />
                  </IconButton>
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

@withStyles(styles)
export class SessionMainContainer extends React.Component<
  {
    classes: any,
    session: Object,
    buttons: Array<Object>,
    visible: boolean,
    students: Array<Object>
  },
  { open: boolean }
> {
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
    const { classes, session, buttons, visible, students } = this.props;

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
                        <SimpleDialog
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
        {...props}
      />
    </div>
  );
};

const SessionController = compose(
  withVisibility,
  withState('showSettings', 'setShowSettings', false)
)(rawSessionController);

SessionController.displayName = 'SessionController';

const TeacherView = withTracker(() => {
  const user = Meteor.users.findOne(Meteor.userId());
  const session = user.profile && Sessions.findOne(user.profile.controlSession);
  const activities =
    session && Activities.find({ graphId: session.graphId }).fetch();
  const students =
    session && Meteor.users.find({ joinedSessions: session.slug }).fetch();
  return {
    sessions: Sessions.find().fetch(),
    session,
    graphs: Graphs.find({ broken: { $ne: true } }).fetch(),
    activities,
    token: GlobalSettings.findOne('token'),
    students,
    user
  };
})(props => (
  <div>
    <SessionController {...props} />
    {props.students && <StudentList students={props.students} />}
    <SessionList {...props} />
  </div>
));

TeacherView.displayName = 'TeacherView';
export default TeacherView;
