import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { uuid } from 'frog-utils';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { InjectData } from 'meteor/staringatlights:inject-data';
import Stringify from 'json-stringify-pretty-compact';
import fs from 'fs';
import { resolve as pathResolve, join } from 'path';

import { activityTypesObj, activityTypes } from '/imports/activityTypes';
import { Sessions } from '/imports/api/sessions';
import { serverConnection } from './share-db-manager';
import { mergeOneInstance } from './mergeData';
import setupH5PRoutes from './h5p';
import { dashDocId } from '../imports/api/logs';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(req => {
  const userAgent = req.headers['user-agent'] || '';
  const IEStrings = ['Windows', 'WOW64', 'Trident'];
  const isIE =
    IEStrings.some(x => userAgent.includes(x)) || userAgent.includes('MSIE');
  const isSafari9or10 =
    (userAgent.includes('Safari/') && userAgent.includes('Version/9')) ||
    (userAgent.includes('Version/10') && userAgent.includes('AppleWebKit'));
  return isIE || isSafari9or10;
}).route('/(.*)', (params, request, response) =>
  response.end(`<html><body><h1>FROG does not support this browser</h1><p>Unfortunately, we do not support Internet Explorer (only Microsoft Edge) or Safari 9/10 (only Safari 11). </p>
  <p>We suggest you use <a href='https://www.google.com/chrome/'><b>Chrome</b></a> or <a href='https://www.mozilla.org/en-US/firefox/new/'><b>Firefox</b></a></p></body></h1>`)
);

setupH5PRoutes();

Picker.filter(req => req.method === 'POST').route(
  '/lti/:slug',
  (params, request, response, next) => {
    const session =
      params.slug && Sessions.findOne({ slug: params.slug.toUpperCase() });
    if (!session) {
      response.writeHead(404);
      response.end();
    } else if (session.settings && session.settings.allowLTI === false) {
      response.writeHead(403);
      response.end();
    } else {
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
        // eslint-disable-next-line no-console
        const { userId } = Accounts.updateOrCreateUserFromExternalService(
          'frog',
          {
            id: user
          }
        );
        Meteor.users.update(userId, { $set: { username: user, userid: id } });
        const stampedLoginToken = Accounts._generateStampedLoginToken();
        Accounts._insertLoginToken(userId, stampedLoginToken);
        InjectData.pushData(request, 'login', {
          token: stampedLoginToken.token,
          slug: params.slug
        });
        next();
      } catch (e) {
        console.error('Error responding to lti request', request.body, e);
        response.writeHead(400);
        response.end();
      }
    }
  }
);

Picker.route('/api/activityTypes', (params, request, response) => {
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

const safeDecode = (json, msg, response) => {
  if (!json) {
    return undefined;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error(e);
    return response.end(msg);
  }
};

const InstanceDone = {};
const DashboardDone = {};
Picker.route(
  '/api/activityType/:activityTypeId',
  ({ activityTypeId, query }, request, response, next) => {
    if (!activityTypesObj[activityTypeId]) {
      response.end('No matching activity type found');
    }
    const activityData = safeDecode(
      query.activity_data,
      'Activity data not valid',
      response
    );
    const config = safeDecode(query.config, 'Config data not valid', response);

    const docId = [
      query.client_id,
      activityTypeId,
      query.activity_id || 'default',
      query.instance_id || 'default'
    ].join('/');
    if (!InstanceDone[docId] && !query.readOnly) {
      InstanceDone[docId] = true;
      const aT = activityTypesObj[activityTypeId];
      Promise.await(
        new Promise(resolve => {
          const doc = serverConnection.get('rz', docId);
          doc.fetch();
          if (doc.type) {
            resolve();
          }
          doc.once(
            'load',
            Meteor.bindEnvironment(() => {
              if (doc.type) {
                resolve();
              } else {
                mergeOneInstance(
                  null,
                  null,
                  aT.dataStructure,
                  aT.mergeFunction,
                  null,
                  null,
                  null,
                  { data: activityData, config: config || {} },
                  docId
                );
                resolve();
              }
            })
          );
        })
      );
    }
    const dashboardId = activityTypeId + '-' + (query.activity_id || 'default');
    if (!DashboardDone[dashboardId] && !query.readOnly) {
      DashboardDone[dashboardId] = true;
      const aT = activityTypesObj[activityTypeId];
      Promise.await(
        new Promise(resolve => {
          if (aT.dashboards) {
            Object.keys(aT.dashboards).forEach(name => {
              const dash = aT.dashboards[name];
              const doc = serverConnection.get(
                'rz',
                dashDocId(dashboardId, name)
              );
              doc.fetch();
              if (doc.type) {
                resolve();
              }
              doc.once(
                'load',
                Meteor.bindEnvironment(() => {
                  if (doc.type) {
                    resolve();
                  } else {
                    doc.create((dash && dash.initData) || {});
                    resolve();
                  }
                })
              );
            });
          }
        })
      );
    }
    InjectData.pushData(response, 'api', {
      callType: 'runActivity',
      activityType: activityTypeId,
      userid: query.userid,
      username: query.username,
      instance_id: docId,
      activity_id: query.activity_id,
      raw_instance_id: query.instance_id || 'default',
      activity_data: activityData,
      readOnly: query.readOnly,
      config
    });
    next();
  }
);

Picker.route(
  '/api/config/:activityTypeId',
  ({ activityTypeId, query }, request, response, next) => {
    if (!activityTypesObj[activityTypeId]) {
      response.end('No matching activity type found');
    }
    const config = safeDecode(query.config, 'Config data not valid', response);

    InjectData.pushData(response, 'api', {
      callType: 'config',
      activityType: activityTypeId,
      config
    });
    next();
  }
);

Picker.route(
  '/api/dashboard/:activityTypeId',
  ({ activityTypeId, query }, request, response, next) => {
    if (!activityTypesObj[activityTypeId]) {
      response.end('No matching activity type found');
    }
    const config = safeDecode(query.config, 'Config data not valid', response);

    InjectData.pushData(response, 'api', {
      callType: 'dashboard',
      activityType: activityTypeId,
      instances: query.instances,
      activity_id: query.activity_id || 'default',
      config
    });
    next();
  }
);

Picker.route('/api/chooseActivity', (req, request, response, next) => {
  InjectData.pushData(response, 'api', {
    callType: 'config'
  });
  next();
});

const allowLocalUpload =
  process.env.NODE_ENV !== 'production' || !Meteor.settings.Minio;

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
    if (!req.query.name) {
      res.writeHead(404);
      res.end();
    }
    let fname;
    if (req.query.name.startsWith('ac/')) {
      const path = req.query.name.split('/');
      const rootPath = pathResolve('.').split('/.meteor')[0];
      fname = join(rootPath, '..', 'ac', path[1], 'clientFiles', path[2]);
    } else {
      fname = req.query.name && '/tmp/' + req.query.name.split('?')[0];
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
