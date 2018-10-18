import * as React from 'react';

import Stop from '@material-ui/icons/Stop';
import Pause from '@material-ui/icons/Pause';
import SkipNext from '@material-ui/icons/SkipNext';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Refresh from '@material-ui/icons/Refresh';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { TimeSync } from 'meteor/mizzao:timesync';
import { uuid } from 'frog-utils';

import {
  removeAllUsers,
  updateSessionState,
  restartSession
} from '/imports/api/sessions';
import { nextActivity } from '/imports/api/engine';
import downloadLog from './downloadLog';
import { exportSession } from './exportComponent';
import { teacherLogger } from '../../../api/logs';
import { LocalSettings } from '../../../api/settings';

let lastNext = null;

const throttledNext = sessionId => {
  if (lastNext && new Date() - lastNext < 10000 && !LocalSettings.debugLogin) {
    // eslint-disable-next-line no-alert
    const response = window.confirm(
      'You very recently pressed next activity. Do you want to advance once more?'
    );
    if (!response) {
      return;
    }
  }
  lastNext = new Date();
  nextActivity(sessionId);
};

export const OrchestrationButtonsModel = (session, classes) => ({
  start: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Start the current session',
      placement: 'top'
    },
    button: {
      color: green[700],
      onClick: () => throttledNext(session._id),
      variant: 'raised'
    },
    icon: <PlayArrow className={classes.icon} />
  },
  stop: {
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
    tooltip: {
      id: 'tooltip-top',
      title: 'Continue the current session',
      placement: 'top'
    },
    button: {
      color: green[700],
      onClick: () => {
        teacherLogger(session._id, 'teacher.pause-resume');
        updateSessionState(session._id, 'STARTED', TimeSync.serverTime());
      },
      variant: 'raised'
    },
    icon: <PlayArrow className={classes.icon} />
  },
  pause: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Pause the current session',
      placement: 'top'
    },
    button: {
      color: red[700],
      onClick: () => {
        teacherLogger(session._id, 'teacher.pause');
        updateSessionState(session._id, 'PAUSED', TimeSync.serverTime());
      },
      variant: 'raised'
    },
    icon: <Pause className={classes.icon} />
  },
  next: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Next Activity',
      placement: 'top'
    },
    button: {
      color: blue[700],
      onClick: () => throttledNext(session._id),
      variant: 'raised'
    },
    icon: <SkipNext className={classes.icon} />
  },
  restart: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Restart Session',
      placement: 'top'
    },
    button: {
      color: red[700],
      onClick: () => {
        lastNext = null;
        restartSession(session);
      },
      variant: 'raised'
    },
    icon: <Refresh className={classes.icon} />
  }
});

export const SessionUtilsButtonsModel = (
  session,
  toggle,
  token,
  openSettings
) => ({
  current: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Active Session Link',
      placement: 'bottom'
    },
    button: {
      onClick: () => {},
      themeColor: 'primary',
      text: `Current Session: ${session.slug}`,
      href: `/${session.slug}`
    },
    source: 'toolbar'
  },
  export: {
    button: {
      onClick: () => exportSession(session._id),
      text: 'Export Session'
    }
  },
  settings: {
    button: {
      onClick: openSettings,
      text: 'Session Settings'
    }
  },
  restart: {
    button: {
      onClick: () => restartSession(session),
      text: 'Restart Session',
      color: red[700]
    }
  },
  removeStudents: {
    button: {
      onClick: () => removeAllUsers(session),
      text: 'Remove All Users from Session',
      color: red[700]
    }
  },
  download: {
    button: {
      onClick: () => downloadLog(session._id),
      text: 'Download log CSV'
    }
  },
  dashboard: {
    button: {
      onClick: () => toggle(),
      text: 'Toggle Dashboard'
    }
  },
  open1: {
    button: {
      onClick: () =>
        window.open(
          `/${session.slug}?followLogin=Chen Li&follow=${
            Meteor.user().username
          }`,
          uuid()
        ),
      text: 'Open one student window'
    }
  },
  open3: {
    button: {
      onClick: () => {
        ['Chen Li', 'Joanna', 'Marius'].forEach(x =>
          window.open(`/${session.slug}?debugLogin=${x}`, uuid())
        );
      },
      text: 'Open 3 student windows'
    }
  },
  open4win: {
    button: {
      onClick: () =>
        window.open(`/multiFollow/${Meteor.user().username}`, uuid()),
      text: 'Open 4 students'
    }
  },
  open3plus1win: {
    button: {
      onClick: () =>
        window.open(
          `/multiFollow/${Meteor.user().username}?layout=3+1`,
          uuid()
        ),
      text: 'Open 3 students+teacher'
    }
  },
  open2plus1plus1win: {
    button: {
      onClick: () =>
        window.open(
          `/multiFollow/${Meteor.user().username}?layout=2+1+1`,
          uuid()
        ),
      text: 'Open 2 students+teacher+projector'
    }
  },
  projector: {
    href: `/teacher/projector/${session.slug}${
      LocalSettings.UrlCoda.length > 0
        ? LocalSettings.UrlCoda
        : `?login=${Meteor.user().username}`
    }&token=${(token && token.value) || ''}`
  }
});

export const ToolTipComponent = ({ tooltip, children }) => (
  <Tooltip id={tooltip.id} title={tooltip.title} placement={tooltip.placement}>
    {children}
  </Tooltip>
);

export const ControlButton = ({ btnModel }) => {
  const { tooltip, button, icon } = btnModel;

  return (
    <ToolTipComponent tooltip={tooltip}>
      <Button
        variant={button.variant || 'flat'}
        color={button.themeColor || 'default'}
        style={{
          backgroundColor: button.color,
          color: 'white'
        }}
        onClick={button.onClick}
      >
        {icon}
        {button.text}
      </Button>
    </ToolTipComponent>
  );
};

export const ControlButtonLink = ({ btnModel, classes }) => {
  const { tooltip, button, icon } = btnModel;

  return (
    <ToolTipComponent tooltip={tooltip}>
      <Button
        variant={button.variant || 'flat'}
        color={button.themeColor || 'default'}
        className={classes.controlBtn}
        style={{ backgroundColor: button.color }}
        onClick={button.onClick}
        href={button.href}
      >
        {icon}
        {button.text}
      </Button>
    </ToolTipComponent>
  );
};
