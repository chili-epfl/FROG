// @flow

import * as React from 'react';

import {
  PlayArrow,
  Stop,
  Pause,
  SkipNext,
  Rewind,
  Refresh
} from '@material-ui/icons';

import { RowButton } from '/imports/ui/RowItems';

const variants = {
  start: {
    title: 'Start the current session',
    icon: PlayArrow
  },
  stop: {
    title: 'Stop the current session',
    icon: Stop
  },
  continue: {
    title: 'Continue the current session',
    icon: PlayArrow
  },
  pause: {
    title: 'Pause the current session',
    icon: Pause
  },
  next: {
    title: 'Next Activity',
    icon: SkipNext
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
    | 'restart',
  onClick: () => void
};

export const ControlButton = (props: ControlButtonProps) => {
  const variant = variants[props.variant];

  const title = variant.title;
  const Icon = variant.icon;

  return (
    <RowButton
      size="large"
      icon={<Icon fontSize="small" />}
      onClick={props.onClick}
    >
      {title}
    </RowButton>
  );
};
