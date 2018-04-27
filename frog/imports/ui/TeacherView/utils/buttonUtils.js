import * as React from 'react';

import Stop from '@material-ui/icons/Stop';
import Pause from '@material-ui/icons/Pause';
import SkipNext from '@material-ui/icons/SkipNext';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Refresh from '@material-ui/icons/Refresh';
import PowerSettingNew from '@material-ui/icons/PowerSettingsNew';
import Create from '@material-ui/icons/Create';
import TrendingUp from '@material-ui/icons/TrendingUp';
import ScreenShare from '@material-ui/icons/ScreenShare';

import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';

import { TimeSync } from 'meteor/mizzao:timesync';
import { updateSessionState, restartSession } from '../../../api/sessions';
import downloadLog from './downloadLog';
import { runSession, nextActivity } from '../../../api/engine';
import { exportSession } from './exportComponent';
import styles from '../styles';

export const OrchestrationButtonsModel = (session, classes) => ({
  start: {
    tooltip: {
      id: 'tooltip-top',
      title: 'Start the current session',
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
      onClick: () => nextActivity(session._id),
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
      onClick: () => restartSession(session),
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
      title: 'Active Session Link. Click for Projecter View',
      placement: 'bottom'
    },
    button: {
      themeColor: 'primary',
      text: `Session : ${session.slug}`,
      href: `/projector/${session.slug}?login=teacher&token=${(token &&
        token.value) ||
        ''}`
    },
    icon: <ScreenShare style={{ marginRight: '5px' }} />,
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
        target="_blank"
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
      title: visible ? 'Orchestration' : 'Dashboard',
      placement: 'top'
    }}
  >
    <Button
      variant="raised"
      className={classes.controlBtn}
      color="primary"
      style={{ backgroundColor: red[700] }}
      onClick={toggleVisible}
    >
      {visible ? (
        <Create
          className={classes.icon}
          style={{ transform: 'rotate(180deg)' }}
        />
      ) : (
        <TrendingUp className={classes.icon} />
      )}
    </Button>
  </ToolTipComponent>
);

export const DashToggle = withStyles(styles)(DashToggleRaw);
