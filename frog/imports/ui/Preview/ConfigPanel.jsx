// @flow

import * as React from 'react';

import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';

const style = {
  side: {
    flex: '0 1 500px',
    position: 'relative',
    overflow: 'auto',
    height: '100%'
  },
  preview: { width: '100%', height: 'calc(100% - 50px)', overflow: 'visible' }
};

export default ({
  config,
  reloadAPIform,
  setConfig,
  activityTypeId,
  setActivityTypeId,
  instances
}: Object) => (
  <div style={style.side} className="bootstrap">
    <ApiForm
      config={config}
      activityType={activityTypeId}
      onConfigChange={e => {
        if (e.errors.length === 0) {
          setConfig(e.config);
          const activityType = activityTypesObj[e.activityType];
          initActivityDocuments(instances, activityType, -1, e.config, true);
          setActivityTypeId(e.activityType);
          initDashboardDocuments(activityType, true);
        } else {
          setConfig({ invalid: true });
        }
      }}
      onPreview={setActivityTypeId}
      reload={reloadAPIform}
    />
  </div>
);
