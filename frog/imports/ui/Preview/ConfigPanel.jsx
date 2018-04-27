// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';

import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';

const style = {
  side: {
    flex: '0 0 auto'
  }
};

class ConfigPanel extends React.Component<*, *> {
  onConfigChange = (e: any) => {
    if (e.errors && e.errors.length === 0) {
      const aT = activityTypesObj[e.activityType];
      this.props.setConfig(e.config);
      initActivityDocuments(this.props.instances, aT, -1, e.config, true);
      initDashboardDocuments(aT, true);
    } else {
      this.props.setConfig({ ...e.config, invalid: true });
    }
    this.props.setActivityTypeId(e.activityType);
  };

  componentDidUpdate = () => {
    if (this.props.activityTypeId && this.props.config.invalid === undefined) {
      check(
        this.props.activityTypeId,
        this.props.config,
        () => {},
        this.onConfigChange
      );
    }
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
