// @flow

import { Meteor } from 'meteor/meteor';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';

import { startShareDB } from './share-db-manager';

import '../imports/startup/shutdown-if-env.js';

import '../imports/api/messages.js';
import '../imports/api/activities.js';
import '../imports/api/graphs.js';
import '../imports/api/sessions.js';
import '../imports/api/logs.js';
import '../imports/api/activityData.js';
import '../imports/api/products.js';
import '../imports/api/objects.js';
import '../imports/api/global.js';
import '../imports/api/engine.js';

// note: this is a wrapper around promises that make them much easier to debug
// should be turned off in production!
const theGlobal = typeof window === 'object' ? window : global;
const realPromiseConstructor = theGlobal.Promise;
const wrappedPromiseConstructor = function(resolve, reject, progress) {
  const originalPromiseInstance = new realPromiseConstructor(
    resolve,
    reject,
    progress
  );

  // Who called us?  Let's store it.
  const stackWhenCalled = new Error().stack;

  const wrappedPromiseInstance = originalPromiseInstance.catch(err => {
    try {
      err.stack = err.stack || '';
      err.stack +=
        '\nDuring promise started:\n' +
        stackWhenCalled.split('\n').slice(3).join('\n');
    } catch (err2) {
      console.error(
        'promiseDebugging.reportLongStackTraces had difficulty adding to the stack:',
        err2
      );
    }
    return realPromiseConstructor.reject(err);
  });

  return wrappedPromiseInstance;
};
Object.setPrototypeOf(wrappedPromiseConstructor, realPromiseConstructor);

theGlobal.Promise = wrappedPromiseConstructor;
// if (process.env.NODE_ENV !== 'production') {
//   require('longjohn');
// }
Meteor.publish('userData', () => Meteor.users.find({}));

startShareDB();
