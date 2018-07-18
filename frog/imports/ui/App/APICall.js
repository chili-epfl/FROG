import * as React from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { createLogger } from '../../api/logs';
import { RunActivity } from '../StudentView/Runner';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';

export default ({ data }) => {
  if (data.callType === 'dashboard') {
    return (
      <DashMultiWrapper
        activity={{
          _id: data.activityType + '-' + data.activityId,
          activityType: data.activityType
        }}
        users={[]}
        config={data.config}
        instances={[]}
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
        activityType={data.activityType}
        config={data.config}
        hidePreview
        hideValidator={data.hideValidator}
      />
    );
  } else {
    const actId = data.activityType + '-' + (data.activityId || 'default');
    const logger = createLogger(
      'headless',
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
    console.log(activityData);
    console.log(data.config);
    return (
      <RunActivity
        logger={
          data.readOnly
            ? () => {}
            : msg => {
                logger(msg);
                window.parent.postMessage(
                  {
                    type: 'frog-log',
                    msg: {
                      activityType: data.activityType,
                      username: data.userName,
                      userid: data.userId,
                      instanceId: data.instanceId,
                      timestamp: new Date(),
                      ...msg
                    }
                  },
                  '*'
                );
              }
        }
        readOnly={data.readOnly}
        activityTypeId={data.activityType}
        username={data.userName || 'Anonymous'}
        userid={data.userId || '1'}
        stream={() => {}}
        reactiveId={data.instanceId}
        groupingValue={data.instanceId}
        activityData={activityData}
      />
    );
  }
};
