// @flow

import * as React from 'react'
import ShareDB from 'sharedb';
import { cloneDeep } from 'lodash';

import { type LogT, type LogDBT, type ActivityPackageT, uuid, generateReactiveFn } from 'frog-utils';

import { DashMultiWrapper } from '../TeacherView/Dashboard'
import { activityTypesObj } from '../../activityTypes';

const backend = new ShareDB();
const connection = backend.connect();
export const DocumentCache = {}
export const Logs: LogDBT[] = [];

export const initDocuments = (activityType: ActivityPackageT, refresh: boolean) => {
  if(activityType && activityType.dashboard) {
    Object.keys(activityType.dashboard).forEach(name => {
      const dash = activityType.dashboard[name];
      if (DocumentCache[name]) {
        if(refresh) {
          const [doc, _ ] = DocumentCache[name]
          doc.submitOp( {p : [], oi: (dash && dash.initData) || {}} )
        }
      } else {
        const doc = connection.get('rz', name);
        doc.fetch();
        if (!doc.type) {
          doc.once('load', () => {
            if (!doc.type) {
              doc.create((dash && dash.initData) || {} );
              const dataFn = generateReactiveFn(doc)
              DocumentCache[name] = [doc, dataFn]
            }
          });
        }
      }

    })
    console.log(DocumentCache)
  }
}

const activityDbObject = (config, activityType) => ({
  _id: 'preview',
  data: config,
  groupingKey: 'group',
  plane: 2,
  startTime: 0,
  actualStartingTime: new Date(Date.now()),
  length: 3,
  activityType
});

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activityType: string,
  activityId: string,
  userId: string,
  activityPlane: number,
  config: Object
) => {
  const aT = activityTypesObj[activityType]

  initDocuments(aT, false)

  const mergeData = (log: LogDBT) => {
    Object.keys(aT.dashboard).forEach(name => {
      if(DocumentCache[name]) {
        const dash = aT.dashboard[name]
        const [doc, dataFn] = DocumentCache[name]
        dash.mergeLog(
          cloneDeep(doc.data),
          dataFn,
          log,
          activityDbObject(config, activityType)
        )
      }
    })
  };

  const logger = (logItems: Array<LogT> | LogT) => {
    const list = Array.isArray(logItems) ? logItems : [logItems];
    list.forEach(logItem => {
      const log = ({
        _id: uuid(),
        userId,
        sessionId,
        activityType,
        activityId: 'preview',
        activityPlane,
        instanceId,
        timestamp: new Date(),
        ...logItem
      });
      Logs.push(log);
      mergeData(log);
    });
  };
  return logger;
};

export const DashPreviewWrapper = ({instances, config, users, activityType}: Object) =>
  <DashMultiWrapper
    activity={activityDbObject(config, activityType.id)}
    config={config}
    docs={DocumentCache}
    instances={instances}
    users={users}
  />
