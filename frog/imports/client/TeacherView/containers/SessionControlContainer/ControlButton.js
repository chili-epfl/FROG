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
import { Activities } from '/imports/api/activities';
import { Graphs } from '/imports/api/graphs';
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

function sendCtrlActionToCellulo(props){
  // "uiStatus" active means the activity is either present on the UI or not (archived)
  // "state" has lifecycle READY => STARTED => [PAUSED] => FINISHED (paused is an optional state)
  // since multiple sessions can be in state STARTED (even though the teacher the will be running at most one session at a time)
  // Thus simplify by assuming we take most recently opened (MRO) READY | STARTED | PAUSED session 

  let mroSession = Sessions.findOne({state:  { $in: ['STARTED', 'READY', 'PAUSED'] }   }, { sort: { startedAt: -1 } }) // -1 is descending order so highest time first
  console.log("slug of MRO sessions") // used for debugging
  console.log(mroSession)
  console.log("slug of MRO sessions end")

  const graphidd = mroSession['graphId']
  const all_activities = Activities.find({ graphId: graphidd }).fetch();
  if (mroSession['state'] == 'READY'){ // if the state is 'READY' the only control action is "start session" in which case signal to Cellulo that it has started sending the relevant signal
    Meteor.call('ws.send', mroSession['slug'], "begin "+JSON.stringify(all_activities))
    Meteor.call('ws.send', mroSession['slug'], "studentCount" + JSON.stringify(Meteor.users.find().count())) // sends number of users
  }
  else {
    Meteor.call('ws.send', mroSession['slug'], "activity data"+JSON.stringify(all_activities))
    Meteor.call('ws.send', mroSession['slug'], props['variant'])
  }

  // If control action is "START" then the state of the session is READY and the nextActivities field is 
  // a list of objects (usually one object) the first element of which is a JSON object with fields {activityId, description}
  // openActivities is an empty list

  // If control action is "PAUSE" then openActivities is a list of ints (representing the ids of the current activities)

  // If action is "Next" then openActivities are done and nextActivities will be the current activity

  // REMARK: the description field (see above) usually ends in (p3) indicating the plane of the activity (class is plane 3, team is plane2, individual is plane1)
  // mroSession.slug 
  console.log(props['variant'])
}

export const ControlButton = (props: ControlButtonProps) => {
  const variant = variants[props.variant];
  // props is of the form {"variant": "pause"}
  const title = variant.title;
  const Icon = variant.icon;

  return (
    <RowButton icon={<Icon fontSize="small" />} onClick={()=>{console.log('inside ControlButton.js'); sendCtrlActionToCellulo(props); props.onClick()}}> 
      {title}
    </RowButton>
  );
};
