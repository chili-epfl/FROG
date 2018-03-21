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
import downloadLog from './Utils/downloadLog';
import { runSession, nextActivity } from '../../api/engine';
import { exportSession } from './Utils/exportComponent';
import styles from './styles';

const DEFAULT_COUNTDOWN_LENGTH = 10000;

const buttons = (session, classes) => ({
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
      },
      variant: 'raised'
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
      onClick: () => updateSessionState(session._id, 'STOPPED'),
      variant: 'raised'
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
        updateSessionState(session._id, 'STARTED', TimeSync.serverTime()),
      variant: 'raised'
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
      onClick: () =>
        updateSessionState(session._id, 'PAUSED', TimeSync.serverTime()),
      variant: 'raised'
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
      onClick: () => nextActivity(session._id),
      variant: 'raised'
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
      onClick: () => restartSession(session),
      variant: 'raised'
    },
    icon: <Refresh className={classes.icon} />,
    source: 'toolbar'
  }
});

const ControlButton = ({ btnModel, classes }) => {
  const { tooltip, button, icon } = btnModel;

  return (
    <Tooltip
      id={tooltip.id}
      title={tooltip.title}
      placement={tooltip.placement}
    >
      <Button
        variant={button.variant || 'flat'}
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
  const buttonsModel = buttons(session, classes);

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
