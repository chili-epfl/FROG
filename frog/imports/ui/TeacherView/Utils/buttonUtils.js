import * as React from 'react';

import Stop from 'material-ui-icons/Stop';
import Pause from 'material-ui-icons/Pause';
import SkipNext from 'material-ui-icons/SkipNext';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Refresh from 'material-ui-icons/Refresh';
import PowerSettingNew from 'material-ui-icons/PowerSettingsNew';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import { TimeSync } from 'meteor/mizzao:timesync';
import {
  removeSession,
  updateSessionState,
  sessionStartCountDown,
  sessionCancelCountDown,
  sessionChangeCountDown,
  restartSession
} from '../../../api/sessions';
import downloadLog from './downloadLog';
import { runSession, nextActivity } from '../../../api/engine';
import { exportSession } from './exportComponent';

export const OrchestrationButtonsModel = (session, classes) => ({
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
    icon: <PowerSettingNew className={classes.icon} />
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
    icon: <Stop className={classes.icon} />
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
    icon: <PlayArrow className={classes.icon} />
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
    icon: <Pause className={classes.icon} />
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
    icon: <SkipNext className={classes.icon} />
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
    icon: <Refresh className={classes.icon} />
  }
});

export const SessionUtilsButtonsModel = session => ({
  current: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Active Session Link',
      placement: 'top'
    },
    button: {
      onClick: () => {},
      themeColor: 'primary',
      href: `/${session.slug}`
    },
    source: 'toolbar'
  },
  export: {
    text: 'Export Session',
    button: {
      onClick: () => exportSession(session._id)
    }
  },
  download: {
    text: 'Download log CSV',
    button: {
      onClick: () => downloadLog(session._id)
    }
  }
});

export const ControlButton = ({ children, btnModel, classes }) => {
  const { tooltip, button, icon } = btnModel;
  const href = button.href || false;

  return (
    <Tooltip
      id={tooltip.id}
      title={tooltip.title}
      placement={tooltip.placement}
    >
      {href ? (
        <Button
          variant={button.variant || 'flat'}
          color={button.themeColor || 'default'}
          className={classes.controlBtn}
          style={{ backgroundColor: button.color }}
          onClick={button.onClick}
          href={button.href}
        >
          {icon}
          {children}
        </Button>
      ) : (
        <Button
          variant={button.variant || 'flat'}
          color={button.themeColor || 'default'}
          className={classes.controlBtn}
          style={{ backgroundColor: button.color }}
          onClick={button.onClick}
        >
          {icon}
        </Button>
      )}
    </Tooltip>
  );
};
