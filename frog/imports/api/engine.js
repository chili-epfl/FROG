import { Meteor } from 'meteor/meteor';

import { updateSessionState } from './sessions';
import { engineLogger } from './logs';

export const runSession = sessionId => Meteor.call('run.session', sessionId);

Meteor.methods({
  'run.session': sessionId => {
    // ----------------------------------------------------------//
    // ------------- ORCHESTRATION ENGINE -----------------------//
    // ----------------------------------------------------------//

    updateSessionState(sessionId, 'STARTED');
    engineLogger(sessionId, {
      message: 'Starting now! get ready!'
    });
  }
});
