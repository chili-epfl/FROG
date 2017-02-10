import { Meteor } from 'meteor/meteor';

import { Activities, Connections, Operators } from './activities';
import {
  Sessions,
  updateSessionState,
  updateSessionActivity
} from './sessions';
import { engineLogger } from './logs';

export const runSession = sessionId => Meteor.call('run.session', sessionId);
export const nextActivity = sessionId =>
  Meteor.call('next.activity', sessionId);

Meteor.methods({
  'run.session': sessionId => {
    updateSessionState(sessionId, 'STARTED');
    engineLogger(sessionId, { message: 'STARTING SESSION' });
  },
  'next.activity': sessionId => {
    const activities = Activities.find({ sessionId }).fetch().sort(
      // Sort the list according to startTime of activities
      (a1, a2) => a1.startTime - a2.startTime
    );
    const session = Sessions.findOne({ _id: sessionId });
    // If no activity has been started, we start the first activity (activities[0])
    if (!session.activityId) {
      updateSessionActivity(sessionId, activities[0]._id);
    }
    activities.forEach((ac, index) => {
      // If it is the current activity and not the last activity, we start the next activity (index + 1)
      if (ac._id === session.activityId && index + 1 < activities.length) {
        updateSessionActivity(sessionId, activities[index + 1]._id);
      }
    });
    engineLogger(sessionId, { message: 'NEXT ACTIVITY' });
  },
  'run.dataflow': (type, itemId, sessionId) => {
    // Find the operators that need to be ran for the current activity
    const types = { operator: Operators, activity: Activities };
    const item = types[type].findOne({ _id: itemId });
    if (!item.computed) {
      engineLogger(sessionId, { message: 'COMPUTING DATA FOR ITEM ' + itemId });
      const connections = Connections.find({ 'target.id': itemId }).fetch();
      connections.forEach(connection =>
        Meteor.call(
          'run.dataflow',
          connection.source.type,
          connection.source.id,
          sessionId
        ));
      // Now everything must have been computed, let's compute the new data
      // ...
      types[type].update({ _id: itemId }, { $set: { computed: true } });
    }
  }
});
