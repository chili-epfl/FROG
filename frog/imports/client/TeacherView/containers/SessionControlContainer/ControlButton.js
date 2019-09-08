// @flow

import * as React from 'react';

import {
  PlayArrow,
  Stop,
  Pause,
  SkipNext,
  Rewind,
  Refresh,
  Clear
} from '@material-ui/icons';

import { RowButton } from '/imports/ui/RowItems';

const variants = {
  start: {
    title: 'Start the session',
    icon: PlayArrow
  },
  stop: {
    title: 'Stop the session',
    icon: Stop
  },
  continue: {
    title: 'Continue the session',
    icon: PlayArrow
  },
  pause: {
    title: 'Pause the session',
    icon: Pause
  },
  next: {
    title: 'Next Activity',
    icon: SkipNext
  },
  close: {
    title: 'Close the activity',
    icon: Clear
  },
  closeSession: {
    title: 'Close the session',
    icon: Clear
  },
  prev: {
    title: 'Previous Activity',
    icon: Rewind
  },
  restart: {
    title: 'Restart Session',
    icon: Refresh
  }
};

type ControlButtonProps = {
  variant:
    | 'start'
    | 'stop'
    | 'continue'
    | 'pause'
    | 'next'
    | 'prev'
    | 'restart'
    | 'close',
  onClick: () => void
};

export const ControlButton = (props: ControlButtonProps) => {
  const variant = variants[props.variant];

  const title = variant.title;
  const Icon = variant.icon;

  return (
    <RowButton icon={<Icon fontSize="small" />} onClick={props.onClick}>
      {title}
    </RowButton>
  );
};
