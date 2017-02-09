import { Meteor } from 'meteor/meteor';

import { Activities, Operators, Connections } from './activities';
import { engineLogger } from './logs';

export const runSession = sessionId => Meteor.call('run.session', sessionId);

Meteor.methods({
  'run.session': sessionId => {
    const activities = Activities.find({ sessionId }).fetch();
    const operators = Operators.find({ sessionId }).fetch();
    const connections = Connections.find({ sessionId }).fetch();

    engineLogger(sessionId, {
      message: 'starting now! get ready!'
    });

    engineLogger(sessionId, {
      nOp: operators.length,
      nAc: activities.length,
      nCo: connections.length
    });

    engineLogger(sessionId, {
      message: "I can't handle it anymore. Session dismissed!"
    });
  }
});
