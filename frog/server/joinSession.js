// @flow
import { Meteor } from 'meteor/meteor';
import { Sessions } from '/imports/api/sessions';
import { ensureReactive } from './mergeData';

function sessionJoin(slug: string) {
  const user = Meteor.users.findOne(this.userId);
  if (user.joinedSessions && user.joinedSessions.includes(slug)) {
    return { result: 'success' };
  }
  const session = Sessions.findOne({ slug }, { sort: { startedAt: -1 } });
  if (!session) {
    return { result: 'error', message: 'No such session' };
  }
  if (session.tooLate && user.username !== 'teacher') {
    return {
      result: 'error',
      message: 'Unfortunately it is too late to join this session.'
    };
  }

  Meteor.users.update(this.userId, { $push: { joinedSessions: slug } });
  ensureReactive(session._id, this.userId);
  return { result: 'success' };
}

Meteor.methods({ 'session.join': sessionJoin });
