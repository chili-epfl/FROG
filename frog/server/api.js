import fs from 'fs';
import { resolve as pathResolve, join } from 'path';
import urlPkg from 'url';
import WebSocket from 'ws';

import { uuid } from '/imports/frog-utils';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { InjectData } from 'meteor/staringatlights:inject-data';
import Stringify from 'json-stringify-pretty-compact';
import bodyParser from 'body-parser';
import requestFun from 'request';

import { activityTypesObj, activityTypes } from '/imports/activityTypes';
import { Sessions } from '/imports/api/sessions';
import { UniqueIds } from '/imports/api/activities';
import { serverConnection } from './share-db-manager';
import { mergeOneInstance } from './mergeData';
import setupH5PRoutes from './h5p';

WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
WebApp.connectHandlers.use(bodyParser.json({ limit: 50000000000 }));
WebApp.connectHandlers.use(bodyParser.text({ limit: '50mb' }));

setupH5PRoutes();

const extractParam = (query, param) =>
  query.split('&').find(x => x.includes(param))
    ? query
        .split('&')
        .find(x => x.includes(param))
        .split('=')[1]
    : undefined;

WebApp.connectHandlers.use('/api/activityTypes', (request, response) => {
  response.end(
    Stringify(
      activityTypes.map(x => ({
        id: x.id,
        type: x.type,
        name: x.meta.name,
        description: x.meta.shortDesc,
        longDescription: x.meta.description,
        runner_url: '/api/activityType/' + x.id,
        config_url: '/api/config/' + x.id
      }))
    )
  );
});

const safeDecode = (query, field, msg, response, returnUndef) => {
  const value = query?.[field];
  if (!value) {
    return returnUndef ? undefined : {};
  }
  try {
    return value && JSON.parse(value);
  } catch (e) {
    console.error(e);
    return response.end(msg);
  }
};

const InstanceDone = {};

const wss = new WebSocket.Server({
  port: 10000
});

const Connections = {};

wss.on(
  'connection',
  Meteor.bindEnvironment((ws, req) => {
    const id = req.url.split('?')[1];
    console.info('connection ', id);
    Connections[id] = ws;
    ws.on(
      'message',
      Meteor.bindEnvironment(data => {
        console.info('received', data);
        try {
          const unique = UniqueIds.findOne(id);
          const logmsg = JSON.parse(data);
          logmsg.activityId = unique.activityId;
          logmsg.activityType = 'ac-cellulo';
          console.info('log msg:', logmsg);
          Meteor.call('merge.log', logmsg);
        } catch (e) {
          ws.send(e.message);
          console.error(e);
        }
      })
    );
  })
);

const wsSend = (id, msg) => {
  if (Connections[id]) {
    Connections[id].send(msg);
  } else {
    throw 'No such websocket id';
  }
};

Meteor.methods({ 'ws.send': wsSend });

WebApp.connectHandlers.use('', (request, response, next) => {
  if (request.headers?.host === 'frogwrite.ch') {
    return frogwrite(request, response, next);
  } else {
    next();
  }
});

WebApp.connectHandlers.use('/frogwrite', (request, response, next) =>
  frogwrite(request, response, next)
);

const frogwrite = (request, response, next) => {
  const url = urlPkg.parse(request.url);
  const instance = url.pathname.substring(0);
  const userId = request.query.user || uuid();
  const userName = request.query.user || 'anonymous';
  const clientId = 'write';
  const activityTypeId = 'ac-single-li';
  const config = { liTypeEditor: 'li-richText', noSubmit: 'true' };
  const readOnly = false;
  const activityId = 'write-ac-single-li-write';
  const docId = activityId + '/' + instance;

  sendActivityRequest({
    next,
    userId,
    userName,
    docId,
    clientId,
    activityTypeId,
    config,
    instance,
    readOnly,
    activityId,
    request
  });
};

WebApp.connectHandlers.use('/api/proxy', (request, response, next) => {
  try {
    request
      .pipe(
        requestFun(urlPkg.parse(request.url).pathname.substring(1)).on(
          'error',
          next
        )
      )
      .pipe(response);
  } catch (e) {
    console.warn(e);
  }
});

WebApp.connectHandlers.use('/api/activityType', (request, response, next) => {
  const url = urlPkg.parse(request.url);
  const activityTypeId = url.pathname.substring(1);
  if (!activityTypesObj[activityTypeId]) {
    response.end('No matching activity type found');
  }

  const activityData = safeDecode(
    request.body,
    'activityData',
    'Activity data not valid',
    response,
    true
  );

  const rawData = safeDecode(
    request.body,
    'rawData',
    'Raw data not valid',
    response,
    true
  );
  if (rawData && activityData) {
    response.end('Cannot provide both activityData and rawData');
  }

  let altConfig = null;
  if (request.query.config) {
    try {
      altConfig = JSON.parse(request.query.config);
    } catch (e) {
      console.warn(e);
    }
  }

  const config =
    altConfig ||
    safeDecode(request.body, 'config', 'Config data not valid', response);

  const activityId = [
    request.query.clientId || request.body.clientId || '',
    activityTypeId,
    request.query.activityId || request.body.activityId || ''
  ].join('-');

  const instance =
    request.body.instanceId || request.query.instanceId || 'default';
  const docId = activityId + '/' + instance;
  const clientId = request.query.clientId || request.body.clientId;
  const userId = request.query.userId || request.body.userId;
  const readOnly = request.query.readOnly || request.body.readOnly;
  const userName = request.query.userName || request.body.userName;
  sendActivityRequest({
    next,
    userId,
    userName,
    docId,
    clientId,
    rawData,
    activityTypeId,
    config,
    instance,
    readOnly,
    activityId,
    activityData,
    request
  });
});

WebApp.connectHandlers.use('/duplicate/', (request, response, next) => {
  const url = urlPkg.parse(request.url);
  const sessionId = url.pathname.substring(1);
  const session = Sessions.findOne(sessionId);
  if (!session || !session.simpleConfig) {
    response.end();
  }
  InjectData.pushData(request, 'duplicate', session.simpleConfig);
  next();
});

WebApp.connectHandlers.use('/write/', (request, response, next) => {
  const url = urlPkg.parse(request.url);
  const instance = url.pathname.substring(1);
  const userId = request.query.user || uuid();
  const userName = request.query.user || 'anonymous';
  const clientId = 'write';
  const activityTypeId = 'ac-single-li';
  const config = { liTypeEditor: 'li-richText', noSubmit: 'true' };
  const readOnly = false;
  const activityId = 'write';
  const docId = activityId + '/' + instance;

  sendActivityRequest({
    next,
    userId,
    userName,
    docId,
    clientId,
    activityTypeId,
    config,
    instance,
    readOnly,
    activityId,
    request
  });
});

const sendActivityRequest = ({
  userId,
  next,
  docId,
  clientId,
  rawData,
  activityId,
  activityTypeId,
  config,
  instance,
  readOnly,
  activityData,
  userName,
  request
}) => {
  if (!InstanceDone[docId] && !rawData) {
    InstanceDone[docId] = true;
    const aT = activityTypesObj[activityTypeId];

    const initData =
      typeof aT.dataStructure === 'function'
        ? aT.dataStructure(config)
        : aT.dataStructure;
    Promise.await(
      new Promise(resolve => {
        const doc = serverConnection.get('rz', docId);
        doc.fetch();
        if (doc.type) {
          resolve();
        }
        doc.once(
          'load',
          Meteor.bindEnvironment(async () => {
            if (doc.type) {
              resolve();
            } else if (rawData) {
              doc.create(rawData);
              resolve();
            } else {
              await mergeOneInstance(
                instance,
                { _id: activityId, data: config || {} },
                initData,
                aT.mergeFunction,
                null,
                null,
                null,
                { data: activityData, config: config || {} },
                null,
                'headless/' + clientId
              );
              resolve();
            }
          })
        );
      })
    );
  }

  InjectData.pushData(request, 'api', {
    callType: 'runActivity',
    activityType: activityTypeId,
    userId,
    userName,
    instanceId: docId,
    activityId,
    activityData,
    clientId,
    rawData,
    readOnly,
    config
  });
  next();
};

WebApp.connectHandlers.use('/api/dashboard/', (request, response, next) => {
  const url = require('url').parse(request.url);
  const activityTypeId = url.pathname.substring(1);
  if (!activityTypesObj[activityTypeId]) {
    response.end('No matching activity type found');
  }

  let altConfig = null;
  if (request.query.config) {
    try {
      altConfig = JSON.parse(request.query.config);
    } catch (e) {
      console.warn(e);
    }
  }

  const activityId = [
    request.query.clientId || request.body.clientId || '',
    activityTypeId,
    request.query.activityId || request.body.activityId || ''
  ].join('-');

  const config =
    altConfig ||
    safeDecode(request.body, 'config', 'Config data not valid', response);

  InjectData.pushData(request, 'api', {
    callType: 'dashboard',
    clientId: request.query.clientId || request.body.clientId || '',
    activityType: activityTypeId,
    instances: request.body.instances,
    activityId,
    config
  });
  next();
});

WebApp.connectHandlers.use('/api/config', (request, response, next) => {
  const url = require('url').parse(request.url);
  const activityTypeId = url.pathname.substring(1);
  if (!activityTypesObj[activityTypeId]) {
    response.end('No matching activity type found');
  }
  const config = safeDecode(
    request.body,
    'config',
    'Config data not valid',
    response
  );
  InjectData.pushData(request, 'api', {
    callType: 'config',
    activityType: activityTypeId,
    showLibrary: request.body.showLibrary,
    showValidator: request.body.showValidator,
    showDelete: request.body.showDelete,
    whiteList: request.body.whiteList,
    config
  });
  next();
});

WebApp.connectHandlers.use('/api/chooseActivity', (request, response, next) => {
  InjectData.pushData(request, 'api', {
    callType: 'config',
    showLibrary: request.body.showLibrary,
    showValidator: request.body.showValidator,
    showDelete: request.body.showDelete,
    whiteList: request.body.whiteList
  });
  next();
});

WebApp.connectHandlers.use('/api/learningitem', (request, response, next) => {
  const url = require('url').parse(request.url);
  const LI = url.pathname.substring(1);
  if (!LI) {
    response.writeHead(422);
    response.end();
    return;
  }
  const type = request.query.type || request.body.type || 'dashboard';
  InjectData.pushData(request, 'api', {
    callType: 'learningItem',
    learningItem: LI,
    type
  });
  next();
});

WebApp.connectHandlers.use('/api/followNext', (request, response) => {
  if (request.query?.follow) {
    const follow = Meteor.users.findOne({ username: request.query.follow });
    if (follow) {
      const sessionId = follow.profile?.controlSession;
      if (sessionId) {
        Meteor.call('next.activity', sessionId);
      }
    }
  }
  response.end();
});

WebApp.connectHandlers.use('/api/followRestart', (request, response) => {
  if (request.query?.follow) {
    const follow = Meteor.users.findOne({ username: request.query.follow });
    if (follow) {
      const sessionId = follow.profile?.controlSession;
      if (sessionId) {
        Meteor.call('sessions.restart', sessionId);
      }
    }
  }
  response.end();
});

WebApp.connectHandlers.use('/api/submitLog', (request, response) => {
  let logmsg;
  try {
    if (request.query.msg) {
      logmsg = JSON.parse(request.query.msg);
    }
  } catch (e) {
    console.error(e);
  }
  if (!logmsg) {
    logmsg = request.body.msg;
  }
  if (!logmsg) {
    response.writeHead(422);
    response.end();
    return;
  }
  Meteor.call('merge.log', logmsg);
  response.writeHead(200);
  response.end();
});

const allowLocalUpload = !Meteor.settings.Minio;

WebApp.connectHandlers.use('/file', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'PUT');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
  } else if (req.method === 'PUT' && allowLocalUpload) {
    req.pipe(fs.createWriteStream('/tmp/' + req.query.name));
    res.writeHead(200);
    res.end();
  } else if (req.method === 'GET') {
    if (!req.query.name && !req.url) {
      res.writeHead(404);
      res.end();
    }
    let fname;
    const url = req.query.name || req.url.substring(1);
    if (url.startsWith('ac/')) {
      const path = url.split('?')[0].split('/');
      const rootPath = pathResolve('.').split('/.meteor')[0];
      fname = join(
        rootPath,
        '..',
        'ac',
        path[1],
        'clientFiles',
        ...path.splice(2)
      );
    } else {
      fname = url && '/tmp/' + url.split('?')[0];
    }
    fs.access(fname, err => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200);
        const readStream = fs.createReadStream(fname);
        readStream.once('open', () => readStream.pipe(res));
      }
    });
  }
});

// return early if headlessOnly and no API has been called with next()
WebApp.connectHandlers.use('/', (req, res, next) => {
  if (Meteor.settings.headlessOnly && !req.headers._injectPayload) {
    res.writeHead(403);
    return res.end('This server only supports API requests');
  }
  return next();
});

WebApp.connectHandlers.use('/multiFollow', (request, response) => {
  let root = Meteor.absoluteUrl();
  if (root.slice(-1) === '/') {
    root = root.slice(0, -1);
  }
  let learnRoot;
  if (root === 'http://localhost:3000') {
    learnRoot = 'http://learn.chilifrog-local.com:3000';
  } else {
    learnRoot = 'https://learn.chilifrog.ch';
  }
  const url = require('url').parse(request.url);
  const layout = url.query ? extractParam(url.query, 'layout') : '';
  const more = url.query ? extractParam(url.query, 'more') : '';

  const scaled = url.scaled
    ? parseInt(extractParam(url.query, 'scaled'), 10)
    : false;
  const follow = url.pathname.substring(1);
  const scaledStr = scaled ? '&scaled=' + scaled : '';
  const template = `
<!DOCTYPE html><html><head>
    <title>Four pane FROG</title>
    <style>
html, body { overflow: none; height: 100%; padding: 0; margin: 0; }
div { overflow: none; width: 50%; height: ${
    layout === '2' ? '100%' : '50%'
  }; float: left; }
#div1 { background: #DDD; }
#div2 { background: #AAA; }
#div3 { background: #777; }
#div4 { background: #444; }
.container { height: calc(100vh - 30px); 
width: 100vw;
overflow: none;
}
.bottom { height: 30px; }
iframe { height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div class="container">
    <div id="div1">
      <iframe id='iframe1' 
     ${
       layout === '3+1' || layout === '2+1+1'
         ? `src=${root}/t/?login=${follow}&scaled=true>`
         : `src=${learnRoot}?follow=${follow}&followLogin=${
             more ? 'Alisa' : 'Chen%20Li'
           }${scaledStr}>`
     }
</iframe>
    </div>
    <div id="div2">
      <iframe id='iframe1' src=${learnRoot}?follow=${follow}&followLogin=${
    layout === '2+1+1' ? follow : more ? 'Niels' : 'Peter'
  }${scaledStr}></iframe>
    </div>
    ${layout !== '2' &&
      `
    <div id="div3">
      <iframe id='iframe1' src=${learnRoot}?follow=${follow}&followLogin=${
        more ? 'Natasha' : 'Anna'
      }${scaledStr}></iframe>
    </div>
    <div id="div4">
      <iframe id='iframe1' src=${learnRoot}?follow=${follow}&followLogin=${
        more ? 'Bob' : 'Aliya'
      }${scaledStr}></iframe>
    </div>`}
    </div class="bottom">
    <span onClick="fetch('/api/followNext?follow=${follow}')">Next</a>
    </div>
</html>`;
  response.end(template);
});

WebApp.connectHandlers.use('/api/wikiSubmit', async (request, response) => {
  console.info(
    'Importing page',
    request.query?.wiki +
      ' / ' +
      request.query?.page +
      ' with ID ' +
      request.query?.id
  );
  try {
    const { wiki, page, id } = request.query;
    const { body } = request;
    if (!wiki || !body || !page) {
      console.info(
        'Require wiki and body request parameters, and body payload with text content type'
      );
      response.end(
        'Require wiki and body request parameters, and body payload with text content type'
      );
    }
    const genericDoc = serverConnection.get('li');
    const dataFn = generateReactiveFn(genericDoc);
    const newId = dataFn.createLearningItem(
      'li-richText',
      body,
      {
        wikiId: wiki
      },
      undefined,
      undefined,
      id
    );

    const op = {
      p: ['pages', newId],
      oi: {
        liId: newId,
        id: newId,
        valid: true,
        created: true,
        title: page,
        liType: 'li-richText',
        plane: 3
      }
    };

    const wikiDoc = serverConnection.get('wiki', wiki);
    await new Promise(resolve => {
      wikiDoc.subscribe(() => {
        if (!wikiDoc.type) {
          wikiDoc.create({ wikiId: wiki, pages: {} });
        }
        wikiDoc.submitOp(op);
        wikiDoc.destroy();
        resolve();
      });
    });

    genericDoc.destroy();

    response.writeHead(200);
    response.end();
  } catch (e) {
    console.error(e);
    response.writeHead(500);
    response.end();
  }
});

WebApp.connectHandlers.use('/lti', (request, response, next) => {
  if (request.method !== 'POST') {
    response.writeHead(403);
    response.end('LTI sessions must use POST requests');
    return;
  }
  const url = require('url').parse(request.url);
  const slug = url.pathname.substring(1);
  const session = slug && Sessions.findOne({ slug: slug.toUpperCase() });
  if (!session) {
    response.writeHead(404);
    response.end('This session does not exist');
    return;
  } else if (session.settings && session.settings.allowLTI === false) {
    response.writeHead(403);
    response.end(
      'This session does not allow LTI login, check the session settings'
    );
    return;
  }
  let user;
  try {
    user = request.body.lis_person_name_full;
  } catch (e) {
    console.error('Error parsing username in lti request', request.body, e);
    user = uuid();
  }
  let id;
  try {
    id = JSON.parse(request.body.lis_result_sourcedid).data.userid;
  } catch (e) {
    console.error('Error parsing userid in lti request', request.body, e);
    id = uuid();
  }
  try {
    const { userId } = Accounts.updateOrCreateUserFromExternalService('frog', {
      id: user
    });
    Meteor.users.update(userId, { $set: { username: user, userid: id } });
    const stampedLoginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(userId, stampedLoginToken);
    InjectData.pushData(request, 'login', {
      token: stampedLoginToken.token,
      slug
    });
    next();
  } catch (e) {
    console.error('Error responding to lti request', request.body, e);
    response.writeHead(400);
    response.end('Error responding to LTI request');
  }
});
