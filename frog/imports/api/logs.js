import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import Stringify from 'json-stable-stringify';
import { uuid } from 'frog-utils';

export const Logs = new Mongo.Collection('logs');

// generates a logging function which is pre-loaded with a JSON object
// the logging function is called with a message, and inserts into the
// logging store the message, merged with the preloaded object, and date

// for example
// const logger = createLogger({app: 'ac-form', user: 'stian'})
// logger({'app started'}) => {app: 'ac-form', user: 'stian', message: 'app started',
//                             date: 'Thursday 22...'}
// TODO: Should perhaps accept an object to log, instead of a message, for more flexibility

export const engineLogger = (sessionId, params) =>
  Logs.insert({
    ...params,
    sessionId,
    createdAt: new Date(),
    _id: uuid()
  });

export const createLogger = merge => {
  const username = Meteor.users.findOne(Meteor.userId()).username;
  const logger = x => {
    Logs.update(
      Stringify(merge),
      { $set: { ...merge, ...x, username, updatedAt: Date() } },
      { upsert: true }
    );
  };
  return logger;
};

export const flushLogs = () => Meteor.call('logs.flush');

Meteor.methods({
  'logs.flush': () => {
    Logs.remove({});
  },
  'test.respond': length => 'response ' + new Array(length).join('*')
});
