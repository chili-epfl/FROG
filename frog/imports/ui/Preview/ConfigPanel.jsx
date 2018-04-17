// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';
import { isEqual } from 'lodash';

import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';

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

class ConfigPanel extends React.Component<*, *> {
  onConfigChange = (e: any) => {
    console.log(e);
    if (e.errors && e.errors.length === 0) {
      const aT = activityTypesObj[e.activityType];
      const _c = e.config;
      this.props.setConfig(_c);
      initActivityDocuments(this.props.instances, aT, -1, _c, true);
      initDashboardDocuments(aT, true);
    } else {
      this.props.setConfig({ invalid: true });
    }
    this.props.setActivityTypeId(e.activityType);
  };

  render() {
    const {
      config,
      reloadAPIform,
      setConfig,
      setExample,
      setShowDashExample,
      activityTypeId,
      setReloadAPIform,
      setActivityTypeId,
      showDash,
      setShowDash,
      instances
    } = this.props;

    return (
      <div style={style.side} className="bootstrap">
        <div>
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
            config={config}
            activityType={activityTypeId}
            onConfigChange={this.onConfigChange}
            onSelect={activityType => {
              const exConf = addDefaultExample(
                activityTypesObj[activityType]
              )[0].config;
              setConfig(exConf);
              if (showDash && !activityTypesObj[activityType].dashboard) {
                setShowDash(false);
              }
              setReloadAPIform(uuid());
              initActivityDocuments(instances, activityType, 0, exConf, true);
              initDashboardDocuments(activityType, true);
              setExample(0);
              setShowDashExample(false);
              setActivityTypeId(activityType);
            }}
            reload={reloadAPIform}
          />
        </div>
      </div>
    );
  }
}

export default ConfigPanel;
