// @flow

import { Meteor } from 'meteor/meteor';
import { generateReactiveFn, splitPathObject } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { SharedbCache } from '../imports/api/cache';

const safelyInsertObject = (doc, dataFn, path, value, instanceId) => {
  const { insertObject, insertPath } = splitPathObject(doc.data, path, value);
  dataFn.objInsert(insertObject, insertPath);
  dataFn.objInsert(instanceId, [
    ...path.slice(0, path.length - 1),
    'instanceId'
  ]);
};

Meteor.methods({
  stream: (activity, instanceId, path, value) => {
    if (activity.streamTarget) {
      const docId = activity.streamTarget + '/all';
      if (SharedbCache[docId]) {
        const [doc, dataFn] = SharedbCache[docId];
        safelyInsertObject(doc, dataFn, path, value, instanceId);
      } else {
        const doc = serverConnection.get('rz', docId);
        doc.subscribe();
        if (doc.type) {
          const dataFn = generateReactiveFn(doc);
          SharedbCache[docId] = [doc, dataFn];
          safelyInsertObject(doc, dataFn, path, value, instanceId);
        } else {
          doc.once('load', () => {
            const dataFn = generateReactiveFn(doc);
            SharedbCache[docId] = [doc, dataFn];
            safelyInsertObject(doc, dataFn, path, value, instanceId);
          });
        }
      }
    }
  }
});
