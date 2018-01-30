// @flow

import React from 'react';
import {Link} from 'react-router-dom';

import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import classNames from 'classnames';
import Paper from 'material-ui/Paper';
import Grow from 'material-ui/transitions/Grow';

import {MenuList, MenuItem, Menu} from 'material-ui/Menu';

import {withStyles} from 'material-ui/styles';

import {Manager, Target, Popper} from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Undo from 'material-ui-icons/Undo';
import Check from 'material-ui-icons/Check';
import Add from 'material-ui-icons/Add';
import ContentCopy from 'material-ui-icons/ContentCopy';
import Delete from 'material-ui-icons/Delete';
import ImportExport from 'material-ui-icons/ImportExport';
import Image from 'material-ui-icons/Image';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Timeline from 'material-ui-icons/Timeline';
import Tooltip from 'material-ui/Tooltip';

import {msToString} from 'frog-utils';
import {TimeSync} from 'meteor/mizzao:timesync';
import {createContainer} from 'meteor/react-meteor-data';
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

const styles = theme => ({
    root: {
        flexGrow: 1,
        display: 'flex'
    },
    popperClose: {
        pointerEvents: 'none'
    },
    undoButton: {
        marginTop: theme.spacing.unit,
        padding: 3,
        width: 35
    },
    button: {
        marginTop: theme.spacing.unit / 2,
        padding: 3,
        width: 35
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
});


@withStyles(styles)
export class SessionTitle extends React.Component {
    state = {
        anchorEl: null,
        open: false
    };

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
        this.setState({open: true});

    };

    handleClose = () => {
        this.setState({anchorEl: null});
        this.setState({open: false});

    };

    render() {
        const {classes, session, buttons} = this.props;
        const {anchorEl, open} = this.state;

        return (
            <div className={classes.root}>
                <Grid
                    container
                    className={classes.root}
                    justify="space-between"
                    spacing={24}
                >
                    <Grid item>
                        <Grid container className={classes.root}>
                            <Grid item>you</Grid>
                            <Grid item>bob</Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography type="body2" gutterBottom>
                            <Button
                                className={classes.button}
                                component={Link}
                                to={`/${session.slug}`}
                            >
                                Current Session: {session.slug}
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container styles={classes.root}>
                            <Grid item>yo</Grid>
                            <Grid item>
                                <div>
                                <Manager>
                                    <Target>
                                        <Tooltip id="tooltip-top" title="graph actions" placement="top">
                                            <IconButton
                                                aria-owns={open ? 'menu-list' : null}
                                                aria-haspopup="true"
                                                onClick={this.handleClick}
                                                color="primary"
                                                className={classes.button}
                                            >
                                                <MoreVertIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Target>
                                    <Popper
                                        placement="bottom-start"
                                        eventsEnabled={open}
                                        className={classNames({[classes.popperClose]: !open})}
                                    >
                                        <ClickAwayListener onClickAway={this.handleClose}>
                                            <Grow
                                                in={open}
                                                id="menu-list"
                                                style={{transformOrigin: '0 0 0'}}
                                            >
                                                <Paper>
                                                    <MenuList role="menu">
                                                        {buttons
                                                            .filter(
                                                                button =>
                                                                    button.source === 'menu' && button.states.indexOf(session.state) > -1 &&
                                                                    (button.countdownStarted === undefined ||
                                                                        session.countdownStartTime > 0 === button.countdownStarted)
                                                            )
                                                            .map(button => (
                                                                <MenuItem
                                                                    key={button.text}
                                                                    onClick={() => {
                                                                        button.onClick();
                                                                        this.handleClose();
                                                                    }}
                                                                    id={button.text}
                                                                >
                                                                    {button.text}
                                                                </MenuItem>
                                                            ))}
                                                    </MenuList>
                                                </Paper>
                                            </Grow>
                                        </ClickAwayListener>
                                    </Popper>
                                </Manager>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const ButtonList = ({
                        session,
                        toggle,
                        setShowStudentList,
                        ...props
                    }: {
    session: Object,
    toggle: Function,
    setShowStudentList: Function
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
            onClick: toggle,
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
    return (
        <div className={classes.root}>
            <SessionTitle session={session} buttons={buttons} {...props} />
            {buttons
                .filter(
                    button =>
                        button.states.indexOf(session.state) > -1 &&
                        (button.countdownStarted === undefined ||
                            session.countdownStartTime > 0 === button.countdownStarted)
                )
                .map(button => (
                    <button
                        key={button.text}
                        className={'btn btn-' + button.type + ' btn-sm'}
                        onClick={button.onClick}
                        id={button.text}
                    >
                        {button.text}
                    </button>
                ))}
            {session.state === 'WAITINGFORNEXT' && <Spinner/>}
            {session.state !== 'CREATED' &&
            session.state !== 'STOPPED' &&
            session.state !== 'WAITINGFORNEXT' && (
                <Countdown
                    startTime={session.countdownStartTime}
                    length={session.countdownLength}
                />
            )}
        </div>
    );
};

export default withStyles(styles)(ButtonList);
