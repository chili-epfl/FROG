// @flow

import * as React from 'react';
import jsonSchemaDefaults from 'json-schema-defaults';
import { isEmpty } from 'lodash';
import { uuid } from 'frog-utils';

import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';

const style = {
  side: {
    flex: '0 1 500px',
    position: 'relative',
    overflow: 'auto',
    height: '100%',
    rightMargin: '20px'
  },
  preview: { width: '100%', height: 'calc(100% - 50px)', overflow: 'visible' }
};

export default ({
  config,
  reloadAPIform,
  setConfig,
  setExample,
  activityTypeId,
  setReloadAPIform,
  setActivityTypeId,
  instances
}: Object) => (
  <div style={style.side} className="bootstrap">
    {activityTypeId && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center'
        }}
      >
        <button
          onClick={() => {
            setActivityTypeId(null);
            setExample(0);
            setConfig({});
            setReloadAPIform(uuid());
          }}
          className="glyphicon glyphicon-arrow-left"
          style={{
            fontSize: '2em',
            color: 'blue',
            border: 0,
            background: 'none',
            cursor: 'pointer'
          }}
        />
        <h3>{activityTypesObj[activityTypeId].meta.name}</h3>
      </div>
    )}
    <ApiForm
      hidePreview
      config={
        isEmpty(config) && activityTypeId
          ? jsonSchemaDefaults(activityTypesObj[activityTypeId].config)
          : config
      }
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
