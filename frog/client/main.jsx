import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config';
import App from '../imports/ui/App';
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

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
