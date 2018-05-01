import * as React from 'react';

import Stop from '@material-ui/icons/Stop';
import Pause from '@material-ui/icons/Pause';
import SkipNext from '@material-ui/icons/SkipNext';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Refresh from '@material-ui/icons/Refresh';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';

import { TimeSync } from 'meteor/mizzao:timesync';
import { updateSessionState, restartSession } from '../../../api/sessions';
import downloadLog from './downloadLog';
import { nextActivity } from '../../../api/engine';
import { exportSession } from './exportComponent';
import styles from '../styles';

let lastNext = null;

const throttledNext = sessionId => {
  if (lastNext && new Date() - lastNext < 10000) {
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
      onClick: () =>
        updateSessionState(session._id, 'STARTED', TimeSync.serverTime()),
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
      onClick: () =>
        updateSessionState(session._id, 'PAUSED', TimeSync.serverTime()),
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
  projector: {
    href: `/projector/${session.slug}?login=teacher&token=${(token &&
      token.value) ||
      ''}`
  }
});

const ToolTipComponent = ({ tooltip, children }) => (
  <Tooltip id={tooltip.id} title={tooltip.title} placement={tooltip.placement}>
    {children}
  </Tooltip>
);

export const ControlButton = ({ btnModel, classes, style }) => {
  const { tooltip, button, icon } = btnModel;

  return (
    <ToolTipComponent tooltip={tooltip}>
      <Button
        variant={button.variant || 'flat'}
        color={button.themeColor || 'default'}
        className={classes.controlBtn}
        style={{
          backgroundColor: button.color,
          ...style
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

const DashToggleRaw = ({
  visible,
  toggleVisible,
  classes
}: {
  visible: boolean,
  toggleVisible: Function,
  classes: Object
}) => (
  <ToolTipComponent
    tooltip={{
      id: 'tooltip-dashtoggle',
      title: 'Toggle between dashboard and graph view',
      placement: 'bottom'
    }}
  >
    <Button
      className={classes.controlBtn}
      variant="raised"
      color="default"
      style={{ backgroundColor: blue[700], color: '#ffffff' }}
      onClick={toggleVisible}
    >
      {visible ? 'Graph' : 'Dashboard'}
    </Button>
  </ToolTipComponent>
);

export const DashToggle = withStyles(styles)(DashToggleRaw);
