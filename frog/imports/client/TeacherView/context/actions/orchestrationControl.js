// @flow

import {
  removeAllUsers,
  updateSessionState,
  restartSession
} from '/imports/api/sessions';
import { nextActivity, goBack } from '/imports/api/engine';
import { teacherLogger } from '/imports/api/logs';

import { TimeSync } from 'meteor/mizzao:timesync';

export const orchestrationControl = (session: Object) => ({
  startSession: () => nextActivity(session._id),
  stopSession: () => updateSessionState(session._id, 'STOPPED'),
  continueSession: () => {
    teacherLogger(session._id, 'teacher.pause-resume');
    updateSessionState(session._id, 'STARTED', TimeSync.serverTime());
  },
  pauseSession: () => {
    teacherLogger(session._id, 'teacher.pause');
    updateSessionState(session._id, 'PAUSED', TimeSync.serverTime());
  },
  next: () => nextActivity(session._id),
  prev: () => {
    const response = window.confirm(
      'Go back one step? Warning, you will loose all data produced since then!'
    );
    if (!response) {
      return;
    }
    goBack(session._id);
  }
});
