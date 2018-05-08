// @flow

import * as React from 'react';
import { uuid } from 'frog-utils';
import ApiForm, { check } from '../GraphEditor/SidePanel/ApiForm';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { addDefaultExample } from './index';

import ExportButton from '../GraphEditor/SidePanel/ActivityPanel/ExportButton';

const styles = {
  side: {
    flex: '0 0 auto',
    overflowY: 'auto',
    width: '30%'
  }
};

class ConfigPanel extends React.Component<*, *> {
  constructor(props: Object) {
    super(props);
    this.state = {
      parentId: ''
    };
  }

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
      <div style={styles.side}>
        {activityTypeId && (
          <div
            className="bootstrap"
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
              activity={{
                title: activityTypesObj[activityTypeId].meta.name,
                data: config,
                activityType: activityTypeId,
                parentId: this.state.parentId
              }}
            />
          </div>
        )}
        <ApiForm
          hidePreview
          {...{ config, setConfig }}
          activityType={activityTypeId}
          onConfigChange={this.onConfigChange}
          onSelect={activityType => {
            const exConf = activityType.title
              ? activityType.config
              : addDefaultExample(activityTypesObj[activityType])[0].config;
            const actTypeId = activityType.title
              ? activityType.activity_type
              : activityType;
            setConfig(exConf);
            if (activityType.uuid)
              this.setState({ parentId: activityType.uuid });
            if (showDash && !activityTypesObj[actTypeId].dashboard) {
              setShowDash(false);
            }
            setReloadAPIform(uuid());
            initActivityDocuments(
              instances,
              activityTypesObj[actTypeId],
              0,
              exConf,
              true
            );
            initDashboardDocuments(actTypeId, true);
            setExample(0);
            setShowDashExample(false);
            setActivityTypeId(actTypeId);
          }}
          reload={reloadAPIform}
        />
      </div>
    );
  }
}

export default ConfigPanel;
