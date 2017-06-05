import ShareDB from 'sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from 'websocket-json-stream';
import ShareDBMongo from 'sharedb-mongo';
import http from 'http';
import { Meteor } from 'meteor/meteor';
import generateReactiveFn from '../imports/api/generateReactiveFn';
import { Activities } from '../imports/api/activities';
import { activityTypesObj } from '../imports/activityTypes';

const db = ShareDBMongo('mongodb://localhost:3001/sharedb');
const server = http.createServer();
const backend = new ShareDB({ db });
export const serverConnection = backend.connect();
const globalState = {};

export const startShareDB = () => {
  new WebSocket.Server({ server }).on('connection', ws => {
    backend.listen(new WebsocketJSONStream(ws));
  });

  server.listen(3002, err => {
    if (err) throw err;
  });
};

export const doOps = (collection, ops) => {
  const doc = serverConnection.get('rz', docId);
  doc.fetch();
  doc.on('ready', () => ops.map(op => doc.submitOp(op)));
};

Meteor.methods({
  'activity.mergeDataOnce': (activityId, object, grouping) => {
    const activity = Activities.findOne(activityId);
    if (
      (activity.hasMergedData && activity.hasMergedData[grouping]) ||
      (globalState[activityId] && globalState[activityId][grouping])
    ) {
      return;
    }
    globalState[activityId] = { ...globalState[activityId], [grouping]: true };
    // the reason for using globalState is that without transactions, just checking the database
    // would sometimes lead to the same thing being done twice. this is still not fool-proof,
    // probably the safest would be for all actions to be triggered by the engine, not by
    // browsers.
    Activities.update(activityId, {
      $set: { hasMergedData: { ...activity.hasMergedData, [grouping]: true } }
    });
    const activityType = activityTypesObj[activity.activityType];
    const mergeFunction = activityType.mergeFunction;
    const doc = serverConnection.get('rz', activityId + '/' + grouping);
    doc.fetch();
    doc.on(
      'load',
      Meteor.bindEnvironment(() => {
        if (!doc.type) {
          doc.create(activityType.dataStructure || {});
        }
        if (mergeFunction) {
          const dataFn = generateReactiveFn(doc);
          mergeFunction(object, dataFn);
        }
      })
    );
  }
});
