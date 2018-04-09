// @flow

import * as React from 'react';
import jsonSchemaDefaults from 'json-schema-defaults';
import { isEmpty } from 'lodash';

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
          const aT = activityTypesObj[e.activityType];
          const _c = isEmpty(e.config)
            ? jsonSchemaDefaults(aT.config)
            : e.config;
          setConfig(_c);
          initActivityDocuments(instances, aT, -1, _c, true);
          initDashboardDocuments(aT, true);
        } else {
          setConfig({ invalid: true });
        }
        setActivityTypeId(e.activityType);
      }}
      onPreview={setActivityTypeId}
      reload={reloadAPIform}
    />
  </div>
);
