import * as React from 'react';

import { DashboardComp } from '../TeacherView/Dashboard';
import { activityTypesObj } from '../../activityTypes';
import { createLogger, createDashboardCollection } from '../../api/logs';
import { RunActivity } from '../StudentView/Runner';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';

export default ({ data }) => {
  if (data.callType === 'dashboard') {
    return (
      <DashboardComp
        activity={{
          _id: data.activityType + '-' + data.activity_id,
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
        hideValidator={data.hideValidator}
      />
    );
  } else {
    const data = data;
    const actId = data.activityType + '-' + (data.activity_id || 'default');
    const logger = createLogger(
      'headless',
      data.raw_instance_id,
      {
        _id: actId,
        activityType: data.activityType
      },
      data.raw_instance_id
    );

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
                      username: data.username,
                      userid: data.userid,
                      instanceId: data.instance_id,
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
        username={data.username || 'Anonymous'}
        userid={data.userid || '1'}
        stream={() => {}}
        reactiveId={data.instance_id}
        groupingValue={data.instance_id}
        activityData={{
          data: data.activity_data,
          config: data.config || {}
        }}
      />
    );
  }
};
