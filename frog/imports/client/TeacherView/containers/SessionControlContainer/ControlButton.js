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
import { Sessions } from '/imports/api/sessions';
//import { Connections } from "imports/../../server/api.js";
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

function sendCtrlActionToCellulo(){
  // "uiStatus" active means the activity is either present on the UI or not (archived)
  // "state" has flow diagram READY => STARTED => [PAUSED] => FINISHED (paused is an optional state)
  // since multiple sessions can be in state STARTED (even though the teacher the will be running at most one session at a time)
  // Thus simplify by assuming we take most recently opened (MRO) READY | STARTED session 

  let mroSession = Sessions.findOne({state:  { $in: ['STARTED', 'READY'] }   }, { sort: { startedAt: -1 } }) // -1 is descending order so highest time first
  console.log("slug of MRO sessions")
  console.log(mroSession)
  console.log("slug of MRO sessions end")
  //const stuff = Sessions.i
    //console.log(" sessionId has value "+JSON.stringify(stuff))
    // Meteor.call('ws.send', Se, "an action was called from inside ControlButton.js");
}

export const ControlButton = (props: ControlButtonProps) => {
  const variant = variants[props.variant];
  // props is of the form {"variant": "pause"}
  const title = variant.title;
  const Icon = variant.icon;
  
  return (
    <RowButton icon={<Icon fontSize="small" />} onClick={()=>{console.log('inside ControlButton.js'); sendCtrlActionToCellulo(); props.onClick()}}> 
      {title}
    </RowButton>
  );
};
