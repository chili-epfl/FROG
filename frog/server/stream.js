// @flow

import { Meteor } from 'meteor/meteor';
import { generateReactiveFn, splitPathObject } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { Cache } from './sharedbCache';

Meteor.methods({
  stream: (activity, instanceId, rawpath, value) => {
    const path = rawpath || [];
    if (activity.streamTarget) {
      const docId = activity.streamTarget + '/all';
      if (Cache[docId]) {
        const [_, dataFn] = Cache[docId];
        dataFn.listAppend(value, path);
      } else {
        const doc = serverConnection.get('rz', docId);
        doc.subscribe();
        if (doc.type) {
          const dataFn = generateReactiveFn(doc);
          Cache[docId] = [doc, dataFn];
          dataFn.listAppend(value, path);
        } else {
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc);
            Cache[docId] = [doc, dataFn];
            dataFn.listAppend(value, path);
          });
        }
      }
    }
  }
});
