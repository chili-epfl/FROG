// @flow
import http from 'http';
import { Meteor } from 'meteor/meteor';
import ShareDB from '@teamwork/sharedb';
import WebSocket from 'ws';
import WebsocketJSONStream from '@teamwork/websocket-json-stream';
import ShareDBMongo from '@teamwork/sharedb-mongo';
import RedisPubsub from '@teamwork/sharedb-redis-pubsub';
import json from '@minervaproject/ot-json0';
import { cloneDeep, isEmpty } from 'lodash';
import richText from '@minervaproject/rich-text';

declare var Promise: any;
const server = http.createServer();

json.type.registerSubtype(richText.type);
ShareDB.types.register(json.type);
ShareDB.types.defaultType = json.type;

const dbUrl =
  (Meteor.settings && Meteor.settings.sharedb_dburl) ||
  'mongodb://localhost:3001/sharedb';

const db = ShareDBMongo(dbUrl);

let options = { db };
if (Meteor.settings.sharedb_redis) {
  const redis = new RedisPubsub({
    url: Meteor.settings.sharedb_redis
  });
  options = { ...options, pubsub: redis };
}

let backend;
try {
  backend = new ShareDB({
    ...options,
    disableDocAction: true,
    disableSpaceDelimitedActions: true
  });
} catch (e) {
  backend = new ShareDB({
    ...options,
    db: ShareDBMongo('mongodb://localhost:27017/sharedb'),
    disableDocAction: true,
    disableSpaceDelimitedActions: true
  });
}
backend.addProjection('wiki_sitemap', 'wiki', { wikiId: true });
export const serverConnection = backend.connect();

export const startShareDB = () => {
  if (!Meteor.settings.dont_start_sharedb) {
    const wserver = new WebSocket.Server({ server });
    wserver.on('connection', (ws, req) => {
      const userId = req.url.split('?')[1];
      ws.on('error', () => null);
      const stream = new WebsocketJSONStream(ws);

      backend.use('connect', (request, next) => {
        Object.assign(request.agent.custom, { userId });
        next();
      });

      backend.use('query', (request, next) => {
        if (request.query?.resetUserId) {
          Object.assign(request.agent.custom, {
            userId: request.query?.resetUserId
          });
          next('400: Userid reset successfully');
        }
        next();
      });
      backend.use('submit', (request, next) => {
        request.op.m.userId = request.agent.custom.userId;
        next();
      });

      stream.on('error', error => {
        if (error.message.startsWith('WebSocket is not open')) {
          // No point reporting this error, as it happens often and is harmless.
          return;
        }
        console.error('Websocket error', error);
      });

      backend.listen(stream);
    });
    // eslint-disable-next-line no-console
    console.info('Running shareDB server');

    const shareDbPort =
      (Meteor.settings && Meteor.settings.public.sharedbport) || 3002;
    // $FlowFixMe
    server.listen(shareDbPort, err => {
      if (err) throw err;
    });
  }
};

const sharedbGetRevisions = (coll, id) =>
  new Promise(resolve =>
    backend.db.getOps(coll, id, 0, null, { metadata: true }, (err, res) => {
      if (err || isEmpty(res)) {
        resolve([]);
        return;
      }
      const beg = res.shift().create.data;
      const revisions = res.reduce(
        (acc, x) => {
          const result = json.type.apply(cloneDeep(acc[acc.length - 1]), x.op);
          acc.push(result);
          return acc;
        },
        [beg]
      );
      resolve(revisions);
    })
  ).catch(e => console.error('Trying to get ops, error', coll, id, e));

const sharedbGetRevisionList = (coll, id) =>
  new Promise(resolve =>
    Meteor.bindEnvironment(
      backend.db.getOps(
        coll,
        id,
        0,
        null,
        { metadata: true },
        Meteor.bindEnvironment((err, res) => {
          if (err || isEmpty(res)) {
            resolve([]);
            return;
          }

          let ts = res[0].m.ts;
          const user = Meteor.users.findOne(res[0].m.userId)?.username;
          let contributors = {};
          let last = res.shift().create.data;
          const milestoneOpsIndices = [
            {
              data: cloneDeep(last),
              contributors: [user],
              time: ts
            }
          ];
          res.forEach(
            Meteor.bindEnvironment((op, i) => {
              last = json.type.apply(cloneDeep(last), op.op);
              const tsDiff = op.m.ts - ts;
              contributors[op.m.userId] = true;
              if (tsDiff > 30000 || i === res.length - 1) {
                milestoneOpsIndices.push({
                  data: cloneDeep(last),
                  contributors: Object.keys(contributors).map(x => {
                    const userObj = Meteor.users.findOne(x);
                    return userObj && !userObj?.isAnonymous
                      ? userObj.username
                      : 'Anonymous User';
                  }),
                  time: op.m.ts
                });
                contributors = {};
              }
              ts = op.m.ts;
            })
          );
          resolve(milestoneOpsIndices);
        })
      )
    )
  ).catch(e => console.error(e));

Meteor.methods({
  'sharedb.get.revisions': sharedbGetRevisions,
  'sharedb.get.revisionList': sharedbGetRevisionList
});
