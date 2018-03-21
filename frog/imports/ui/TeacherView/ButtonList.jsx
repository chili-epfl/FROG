import Button from 'material-ui/Button';
import * as React from 'react';
import Grid from 'material-ui/Grid';

import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import SkipNext from 'material-ui-icons/SkipNext';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Refresh from 'material-ui-icons/Refresh';
import PowerSettingNew from 'material-ui-icons/PowerSettingsNew';

import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import Tooltip from 'material-ui/Tooltip';
import { withVisibility, msToString } from 'frog-utils';

import { withStyles } from 'material-ui/styles';

import { TimeSync } from 'meteor/mizzao:timesync';
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
import styles from './styles';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const ControlButton = ({ btnModel, classes }) => {
  const { tooltip, button, icon } = btnModel;

  return (
    <Tooltip
      id={tooltip.id}
      title={tooltip.title}
      placement={tooltip.placement}
    >
      <Button
        variant="raised"
        className={classes.controlBtn}
        style={{ backgroundColor: button.color }}
        onClick={button.onClick}
      >
        {icon}
      </Button>
    </Tooltip>
  );
};

const ButtonListContainer = ({
  session,
  toggle,
  toggleVisibility,
  classes
}) => {
  const buttonsModel = {
    start: {
      text: 'Start',
      states: ['CREATED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Star the current session',
        placement: 'top'
      },
      button: {
        color: blue[700],
        onClick: () => {
          runSession(session._id);
          nextActivity(session._id);
        }
      },
      icon: <PowerSettingNew className={classes.icon} />,
      source: 'toolbar'
    },
    stop: {
      text: 'Stop Activity',
      states: ['CREATED', 'STARTED', 'PAUSED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Stop the current session',
        placement: 'top'
      },
      button: {
        color: red[700],
        onClick: () => updateSessionState(session._id, 'STOPPED')
      },
      icon: <Stop className={classes.icon} />,
      source: 'toolbar'
    },
    continue: {
      text: 'Continue Activity',
      states: ['CREATED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Continue the current session',
        placement: 'top'
      },
      button: {
        color: green[700],
        onClick: () =>
          updateSessionState(session._id, 'STARTED', TimeSync.serverTime())
      },
      icon: <PlayArrow className={classes.icon} />,
      source: 'toolbar'
    },
    pause: {
      text: 'Pause Activity',
      states: ['CREATED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Pause the current session',
        placement: 'top'
      },
      button: {
        color: red[700],
        onClick: () => {}
      },
      icon: <Pause className={classes.icon} />,
      source: 'toolbar'
    },
    next: {
      text: 'Next Activity',
      states: ['STARTED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Next Activity',
        placement: 'top'
      },
      button: {
        color: blue[700],
        onClick: () => nextActivity(session._id)
      },
      icon: <SkipNext className={classes.icon} />,
      source: 'toolbar'
    },
    restart: {
      text: 'Restart Activity',
      states: ['CREATED'],
      tooltip: {
        id: 'tooltip-top',
        title: 'Restart Activity',
        placement: 'top'
      },
      button: {
        color: red[700],
        onClick: () => restartSession(session)
      },
      icon: <Refresh className={classes.icon} />,
      source: 'toolbar'
    }
  };
  const buttons = [
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
    <Grid
      container
      spacing={8}
      alignItems="center"
      direction="row"
      justify="space-between"
    >
      <Grid item>
        <ControlButton btnModel={buttonsModel.start} classes={classes} />
      </Grid>
      <Grid item>
        <ControlButton btnModel={buttonsModel.stop} classes={classes} />
        <ControlButton btnModel={buttonsModel.continue} classes={classes} />
        <ControlButton btnModel={buttonsModel.pause} classes={classes} />
        <ControlButton btnModel={buttonsModel.next} classes={classes} />
      </Grid>
      <Grid item>
        <ControlButton btnModel={buttonsModel.restart} classes={classes} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ButtonListContainer);
