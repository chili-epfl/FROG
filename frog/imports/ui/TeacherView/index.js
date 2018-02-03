// @flow

import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {withVisibility} from 'frog-utils';
import {compose, withState} from 'recompose';
import Grid from 'material-ui/Grid';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import {withStyles} from 'material-ui/styles';
import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import IconButton from 'material-ui/IconButton'
import PlayArrow from 'material-ui-icons/PlayArrow';


import styled from 'styled-components';

import StudentList from './StudentList';
import StudentListModal from './StudentListModal';
import ButtonList from './ButtonList';
import SessionList from './SessionList';
import GraphView from './GraphView';
import Dashboards from './Dashboard';
import {Sessions} from '../../api/sessions';
import {Activities} from '../../api/activities';
import {Graphs} from '../../api/graphs';
import {msToString} from 'frog-utils';
import {TimeSync} from 'meteor/mizzao:timesync';
import Spinner from 'react-spinner';
import downloadLog from './downloadLog';
import {exportSession} from './exportComponent';

import {
    removeSession,
    updateSessionState,
    sessionStartCountDown,
    sessionCancelCountDown,
    sessionChangeCountDown,
    restartSession
} from '../../api/sessions';
import {runSession, nextActivity} from '../../api/engine';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const CountdownDiv = styled.div`
  border: solid 2px;
  width: 65px;
  text-align: center;
`;

const CountdownPure = ({startTime, length, currentTime}) => {
    const remainingTime = startTime + length - currentTime;
    return (
        <CountdownDiv>
            {msToString(startTime > 0 ? remainingTime : length)}
        </CountdownDiv>
    );
};

const Countdown = createContainer(
    props => ({...props, currentTime: TimeSync.serverTime()}),
    CountdownPure
);

const styles = {
    root: {
        flexGrow: 1,
        padding: 0,
        margin: 0,
    },
    sheet: {
        padding: 0,
        maxHeight: '100%',
        overflow: 'auto',
        backgroundColor: 'red'
    },
    paper: {
        textAlign: 'center',
    },
    gridItem: {
        padding: 0,
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    icon: {
        color: 'white'
    }
};

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
            text: 'Start'
        },
        {
            states: ['STARTED'],
            type: 'primary',
            onClick: () => nextActivity(session._id),
            text: 'Next Activity'
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
            text: 'Pause'
        },
        {
            states: ['PAUSED', 'STOPPED'],
            type: 'primary',
            onClick: () =>
                updateSessionState(session._id, 'STARTED', TimeSync.serverTime()),
            text: 'Continue'
        },
        {
            states: ['CREATED', 'STARTED', 'PAUSED'],
            type: 'danger',
            onClick: () => updateSessionState(session._id, 'STOPPED'),
            text: 'Stop'
        },
        {
            states: ['STOPPED'],
            type: 'danger',
            onClick: () => removeSession(session._id),
            text: 'Delete'
        },
        {
            states: ['CREATED', 'STARTED', 'PAUSED'],
            type: 'primary',
            onClick: () => setShowStudentList(true),
            text: 'Edit student list'
        },
        {
            states: ['CREATED', 'STARTED', 'PAUSED'],
            type: 'primary',
            onClick: () => restartSession(session),
            text: 'Restart session'
        },
        {
            states: ['STARTED'],
            countdownStarted: false,
            type: 'primary',
            onClick: () => sessionStartCountDown(session._id, TimeSync.serverTime()),
            text: 'Start Countdown'
        },
        {
            states: ['STARTED', 'PAUSED'],
            countdownStarted: true,
            type: 'danger',
            onClick: () => sessionCancelCountDown(session._id),
            text: 'Cancel Countdown'
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
            text: '+' + msToString(DEFAULT_COUNTDOWN_LENGTH)
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
            text: '-' + msToString(DEFAULT_COUNTDOWN_LENGTH)
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

    const {classes} = props;
    const stopButton = buttons.filter(button => button.text === 'Stop');
    const startButton = buttons.filter(button => button.text === 'Start');
    const pauseButton = buttons.filter(button => button.text === 'Pause');
    const continueButton = buttons.filter(button => button.text === 'Continue');
    const nextActivityButton = buttons.filter(button => button.text === 'Next Activity');

    return (
        <div style={styles.root}>
            {session ? (
                <Grid id="main-container" container spacing={0}>
                    <Grid id="button-list" item xs={12}>
                        <ButtonList
                            session={session}
                            buttons={buttons}
                            toggle={toggleVisibility}
                            setShowStudentList={setShowStudentList}
                        />
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
                                    <Typography type="title" style={styles.title}>Session
                                        Graph</Typography>
                                    <GraphView session={session}/>
                                </CardContent>
                                <CardActions style={{textAlign: 'center', backgroundColor: 'blue'}}>
                                    <Grid container
                                          spacing={8}
                                          alignItems="center"
                                          direction="row"
                                          justify="center">

                                            <Grid  item>
                                                <Tooltip id="tooltip-top" title="session stop" placement="top">
                                                    <Button raised style={{backgroundColor: 'red', minWidth: 15}}>
                                                        <Stop style={styles.icon}/>
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip id="tooltip-top" title="session play" placement="top">
                                                    <Button raised style={{backgroundColor: 'green', minWidth: 15}}>
                                                        <PlayArrow style={styles.icon}/>
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip id="tooltip-top" title="session pause" placement="top">
                                                    <Button raised style={{backgroundColor: 'red', minWidth: 15}}>
                                                        <Pause style={styles.icon}/>
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
                    <p>Create or select a session from the list below</p>
                </div>
            )}
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
            session && Activities.find({graphId: session.graphId}).fetch();
        const students =
            session && Meteor.users.find({joinedSessions: session.slug}).fetch();

        return {
            sessions: Sessions.find().fetch(),
            session,
            graphs: Graphs.find({broken: {$ne: true}}).fetch(),
            activities,
            students,
            user
        };
    },
    props => (
        <div className={props.classes.root}>
            <SessionController {...props} />
        </div>
    )
);

TeacherView.displayName = 'TeacherView';
export default withStyles(styles)(TeacherView);
