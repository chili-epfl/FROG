import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor'
import { uuid } from 'frog-utils'

export const Logs = new Mongo.Collection('log');

// generates a logging function which is pre-loaded with a JSON object
// the logging function is called with a message, and inserts into the
// logging store the message, merged with the preloaded object, and date

// for example 
// const logger = createLogger({app: 'ac-form', user: 'stian'})
// logger({'app started'}) => {app: 'ac-form', user: 'stian', message: 'app started',
//                             date: 'Thursday 22...'}
// TODO: Should perhaps accept an object to log, instead of a message, for more flexibility

export const createLogger = (merge) => { 
  const logger = (x) => {
    const logentry = {...merge, _id: uuid(), created_at: Date(), message: x}
    Logs.insert(logentry)
  }
  return logger
}

export const flushLogs = () =>
  Meteor.call('logs.flush')

Meteor.methods({
  'logs.flush'() {

    Logs.remove({})
  }
})
