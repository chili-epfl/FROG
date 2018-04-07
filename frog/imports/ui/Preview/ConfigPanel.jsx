// @flow

import * as React from 'react';

import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Preview';
import { activityTypesObj } from '../../activityTypes';

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
  instances,
  history
}: Object) => (
  <div style={style.side} className="bootstrap">
    <ApiForm
      config={config}
      activityType={activityTypeId}
      onConfigChange={e => {
        setConfig(e.errors.length === 0 ? e.config : { invalid: true });
        setActivityTypeId(e.activityType);
        const activityType = activityTypesObj[e.activityType];
        initActivityDocuments(instances, activityType, -1, true);
      }}
      onPreview={e => history.push(`/preview/${e}`)}
      reload={reloadAPIform}
    />
  </div>
);
