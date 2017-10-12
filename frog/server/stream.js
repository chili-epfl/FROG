// @flow

import { Meteor } from 'meteor/meteor';
import { cloneDeep } from 'lodash';
import { generateReactiveFn, splitPathObject } from 'frog-utils';

import { serverConnection } from './share-db-manager';
import { activityTypesObj } from '../imports/activityTypes';
import { Logs } from '../imports/api/logs';

const Cache = {};

const safelyInsertObject = (doc, dataFn, path, value) => {
  const {insertObject, insertPath} = splitPathObject(doc.data, path, value)
  dataFn.objInsert(insertObject, insertPath);
}

Meteor.methods({
  'stream': (activity, path, value) => {
    if (activity.streamTarget) {
      console.log('bonjour', activity.streamTarget)
      const docId = activity.streamTarget + '/all';
      if (Cache[docId]) {
        console.log('use cache')
        const [doc, dataFn] = Cache[docId];
        safelyInsertObject(doc, dataFn, path, value);
      } else {
        console.log('create cache')
        const doc = serverConnection.get('rz', docId);
        doc.fetch();
        doc.on('load', () => {
          console.log('create cache now')
          const dataFn = generateReactiveFn(doc);
          Cache[docId] = [doc, dataFn];
          safelyInsertObject(doc, dataFn, path, value);
        });
      }
    }
  }
});
