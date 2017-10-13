// @flow

import { Meteor } from 'meteor/meteor';
import { generateReactiveFn, splitPathObject } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { Cache } from './sharedbCache';

const safelyInsertObject = (doc, dataFn, path, value) => {
  const { insertObject, insertPath } = splitPathObject(doc.data, path, value);
  dataFn.objInsert(insertObject, insertPath);
};

Meteor.methods({
  stream: (activity, path, value) => {
    if (activity.streamTarget) {
      const docId = activity.streamTarget + '/all';
      if (Cache[docId]) {
        const [doc, dataFn] = Cache[docId];
        safelyInsertObject(doc, dataFn, path, value);
      } else {
        const doc = serverConnection.get('rz', docId);
        doc.subscribe();
        if (doc.type) {
          const dataFn = generateReactiveFn(doc);
          Cache[docId] = [doc, dataFn];
          safelyInsertObject(doc, dataFn, path, value);
        } else {
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc);
            Cache[docId] = [doc, dataFn];
            safelyInsertObject(doc, dataFn, path, value);
          });
        }
      }
    }
  }
});
