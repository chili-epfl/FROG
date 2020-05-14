// @flow

import * as React from 'react';
//import { celluloUrl } from '/server/api';

import {
  PlayArrow,
  Stop,
  Pause,
  SkipNext,
  FastRewind,
  Refresh,
  Clear
} from '@material-ui/icons';
//import { Sessions } from '../../../../api/sessions';
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
    icon: FastRewind
  },
  restart: {
    title: 'Restart Session',
    icon: Refresh
  }
};

// all of these activities need to be synchronized with Cellulo
type ControlButtonProps = {
  variant:
    | 'start'
    | 'stop'
    | 'continue'
    | 'pause'
    | 'next'
    | 'prev'
    | 'restart'
    | 'closeSession'
    | 'close',
  onClick: () => void
};


export const ControlButton = (props: ControlButtonProps) => {
  const variant = variants[props.variant];
  // props is of the form {"variant": "pause"}
  const title = variant.title;
  const Icon = variant.icon;

  return (
    <RowButton icon={<Icon fontSize="small" />} onClick={()=>{props.onClick()}}>
      {title}
    </RowButton>
  );
};
