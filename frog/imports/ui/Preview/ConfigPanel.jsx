// @flow

import * as React from 'react';

import ApiForm from '../GraphEditor/SidePanel/ApiForm';

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
  history
}) => (
  <div style={style.side} className="bootstrap">
    <ApiForm
      config={config}
      activityType={activityTypeId}
      onConfigChange={e => {
        if (e.errors.length === 0) {
          setConfig(e.config);
        } else {
          setConfig({ invalid: true });
        }
        setActivityTypeId(e.activityType);
      }}
      onPreview={e => history.push(`/preview/${e}`)}
      reload={reloadAPIform}
    />
  </div>
);
