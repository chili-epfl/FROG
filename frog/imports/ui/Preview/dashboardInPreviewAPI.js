// @flow

import * as React from 'react';
import { cloneDeep } from 'lodash';
import Spinner from 'react-spinner';
import { withState } from 'recompose';

import {
  type LogT,
  type LogDBT,
  type ActivityPackageT,
  uuid,
  pureObjectReactive
} from 'frog-utils';

import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { activityTypesObj } from '../../activityTypes';

export const DocumentCache = {};
export const Logs: LogDBT[] = [];

if (window) {
  window.DocumentCache = DocumentCache;
}

export const initDashboardDocuments = (
  activityType: ActivityPackageT,
  refresh: boolean
) => {
  if (activityType && activityType.dashboard) {
    Object.keys(activityType.dashboard).forEach(name => {
      const dash = activityType.dashboard[name];
      const initData = cloneDeep((dash && dash.initData) || {});
      if (DocumentCache[name]) {
        if (refresh) {
          const [_, dataFn] = DocumentCache[name];
          dataFn.objInsert(initData, []);
        }
      } else {
        DocumentCache[name] = pureObjectReactive(initData);
      }
    });
  }
};

export const hasDashExample = (aT: ActivityPackageT) =>
  aT.dashboard &&
  Object.keys(aT.dashboard).reduce(
    (acc, name) => acc || !!aT.dashboard[name].exampleLogs,
    false
  );

export const activityDbObject = (
  config: Object,
  activityType: string,
  startingTime?: Date
) => ({
  _id: 'preview',
  data: config,
  groupingKey: 'group',
  plane: 2,
  startTime: 0,
  actualStartingTime: startingTime || new Date(Date.now()),
  length: 3,
  activityType
});

export const mergeData = (
  aT: ActivityPackageT,
  log: LogDBT,
  config: Object,
  startingTime?: Date
) => {
  if (aT.dashboard) {
    Object.keys(aT.dashboard).forEach(name => {
      if (DocumentCache[name]) {
        const dash = aT.dashboard[name];
        const [doc, dataFn] = DocumentCache[name];
        dash.mergeLog(
          doc.data,
          dataFn,
          log,
          activityDbObject(config, aT.id, startingTime)
        );
      }
    });
  }
};

export const createLogger = (
  sessionId: string,
  instanceId: string,
  activityType: string,
  activityId: string,
  userId: string,
  activityPlane: number,
  config: Object
) => {
  const aT = activityTypesObj[activityType];

  initDashboardDocuments(aT, false);

  const startingTime = new Date();
  const logger = (logItems: Array<LogT> | LogT) => {
    const list = Array.isArray(logItems) ? logItems : [logItems];
    list.forEach(logItem => {
      const log = {
        _id: uuid(),
        userId,
        sessionId,
        activityType,
        activityId: 'preview',
        activityPlane,
        instanceId,
        timestamp: new Date(),
        ...logItem
      };
      Logs.push(log);
      mergeData(aT, log, config, startingTime);
    });
  };
  return logger;
};

export const DashPreviewWrapper = withState('ready', 'setReady', false)(
  (props: Object) => {
    const { instances, users, activityType, config, ready, setReady } = props;
    if (!ready) {
      initDashboardDocuments(activityType, false);
      setReady(true);
    }
    return ready ? (
      <DashMultiWrapper
        activity={activityDbObject(config, activityType.id)}
        docs={DocumentCache}
        instances={instances}
        users={users}
      />
    ) : (
      <Spinner />
    );
  }
);
