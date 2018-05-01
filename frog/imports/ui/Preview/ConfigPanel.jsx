// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';

import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';

import ExportButton from '../GraphEditor/SidePanel/ActivityPanel/ExportButton';

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
              <ExportButton
                activity={{ title: activityTypesObj[activityTypeId].meta.name, data: config }}
                madeChanges={() => console.log('changes')}
              />
            </div>
          )}
          <ApiForm
            hidePreview
            {...{config, setConfig}}
            activityType={activityTypeId}
            onConfigChange={this.onConfigChange}
            onSelect={activityType => {// activityTypesObj[activityType.activity_type]
              console.log(activityType)
              const exConf = activityType.title ? activityType.config : addDefaultExample(
                activityTypesObj[activityType]
              )[0].config;
              const actType = activityType.title ? activityTypesObj[activityType.activity_type] : activityType;
                setConfig(exConf);
                if (showDash && !activityTypesObj[actType].dashboard) {
                  setShowDash(false);
                }
                setReloadAPIform(uuid());
                console.log(actType)
                initActivityDocuments(instances, actType, 0, exConf, true);
                initDashboardDocuments(actType, true);
                setExample(0);
                setShowDashExample(false);
                setActivityTypeId(actType.id);
            }}
            reload={reloadAPIform}
          />
        </div>
      </div>
    );
  }
}

export default ConfigPanel;
