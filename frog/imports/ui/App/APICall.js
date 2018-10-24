// @flow

import * as React from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { uuid } from 'frog-utils';

import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { createLogger } from '../../api/logs';
import { RunActivity } from '../StudentView/Runner';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { LocalSettings } from '../../api/settings';

export default ({ data }: { data: Object }) => {
  LocalSettings.api = true;
  if (data.callType === 'dashboard') {
    return (
      <DashMultiWrapper
        activity={{
          _id: [
            data.clientId,
            data.activityType,
            data.activityId || 'default'
          ].join('-'),
          activityType: data.activityType,
          data: data.config,
          length: 900,
          startTime: 0
        }}
        users={{}}
        config={data.config}
        object={{
          activityData: {
            structure: 'all',
            payload: { all: { data: {}, config: {} } }
          },
          socialStructure: {},
          globalStructure: { students: {}, studentIds: [] }
        }}
        instances={[]}
        ready
      />
    );
  }
  if (data.callType === 'config') {
    if (data.injectCSS) {
      DocHead.addLink({
        rel: 'stylesheet',
        type: 'text/css',
        href: data.injectCSS
      });
    }
    return (
      <ApiForm
        whiteList={data.whiteList}
        activityType={data.activityType}
        config={data.config}
        hidePreview
        noOffset
        hideValidator={!data.showValidator}
        hideLibrary={!data.showLibrary}
        showDelete={data.showDelete}
      />
    );
  } else {
    const actId = [
      data.clientId,
      data.activityType,
      data.activityId || 'default'
    ].join('-');
    const logger = createLogger(
      'headless/' + data.clientId,
      data.rawInstanceId,
      {
        _id: actId,
        activityType: data.activityType
      },
      data.rawInstanceId
    );
    const activityData = {
      data: data.activityData,
      config: data.config || {}
    };
    const apilogger = data.readOnly
      ? () => {}
      : msg => {
          logger(msg);
          const logs = Array.isArray(msg) ? msg : [msg];
          logs.forEach(log => {
            window.parent.postMessage(
              {
                type: 'frog-log',
                msg: {
                  id: uuid(),
                  activityType: data.activityType,
                  username: data.userName,
                  userid: data.userId,
                  timestamp: new Date(),
                  ...log
                }
              },
              '*'
            );
          });
        };
    return (
      <RunActivity
        logger={apilogger}
        readOnly={data.readOnly}
        activityTypeId={data.activityType}
        username={data.userName || 'Anonymous'}
        userid={data.userId || '1'}
        stream={() => {}}
        reactiveId={data.instanceId}
        groupingValue={data.instanceId}
        activityData={activityData}
        rawData={data.rawData}
        sessionId={data.activityId}
        activityId={data.activityId}
        groupingKey="group"
      />
    );
  }
};
