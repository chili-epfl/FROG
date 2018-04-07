// @flow

import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { uuid } from 'frog-utils';

import Icon from './Icon';
import {
  initDashboardDocuments,
  hasDashExample,
  Logs
} from './dashboardInPreviewAPI';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';

export default ({
  activityTypeId,
  instances,
  config,
  setFullWindow,
  fullWindow,
  example,
  setConfig,
  setShowData,
  showData,
  setShowDash,
  showDash,
  setShowDashExample,
  showDashExample,
  setShowLogs,
  setReloadAPIform,
  showLogs,
  isSeparatePage,
  setActivityTypeId,
  setExample
}: Object) => {
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return <p>Choose and activityType</p>;
  }
  const examples = activityType.meta.exampleData || [];
  const ex = showDashExample ? activityType.dashboard.exampleLogs : examples;

  const refresh = () => {
    initActivityDocuments(instances, activityType, example, config, true);
    // resets the reactive documents for the dashboard
    initDashboardDocuments(activityType, true);
    Logs.length = 0;
  };

  const dismiss = () => {
    setActivityTypeId(null);
    setExample(-1);
    setConfig({});
    setReloadAPIform(uuid());
    Logs.length = 0;
  };

  return (
    <div className="bootstrap modal-header" style={{ overflow: 'auto' }}>
      <button
        type="button"
        className="close"
        onClick={dismiss}
        data-tip="Close, and show list of activity types to preview"
      >
        X
      </button>
      <h4 className="modal-title">
        {'Preview of ' + activityType.meta.name + ' (' + activityType.id + ')'}
        <Icon
          onClick={() => setShowData(!showData)}
          icon={showData ? 'fa fa-address-card-o' : 'fa fa-table'}
          tooltip={showData ? 'Show component' : 'Show underlying data'}
        />
        {activityType.dashboard && (
          <Icon
            onClick={() => setShowDash(!showDash)}
            icon="fa fa-tachometer"
            color={showDash ? '#3d76b8' : '#b3cae6'}
            tooltip="Toggle dashboard"
          />
        )}
        {hasDashExample(activityType) && (
          <Icon
            onClick={() => setShowDashExample(!showDashExample)}
            icon="fa fa-line-chart"
            color={showDashExample ? '#3d76b8' : '#b3cae6'}
            tooltip="Toggle example logs dashboard"
          />
        )}
        <Icon
          onClick={() => setShowLogs(!showLogs)}
          icon="fa fa-list"
          color={showLogs ? '#3d76b8' : '#b3cae6'}
          tooltip="Toggle log table"
        />
        <Icon
          onClick={refresh}
          icon="fa fa-refresh"
          tooltip="Reset reactive data"
        />
        <Icon
          onClick={() => setFullWindow(!fullWindow)}
          icon="fa fa-arrows-alt"
          tooltip="Toggle full window"
        />
        {!isSeparatePage && (
          <Link
            style={{ marginLeft: '10px' }}
            to={`/preview/${activityType.id}/${example}`}
          >
            <i className="fa fa-share" data-tip="Open in permanent URL" />
          </Link>
        )}
      </h4>
      <Nav bsStyle="pills" activeKey={example}>
        {ex &&
          ex.map((x, i) => (
            <NavItem
              key={x.title}
              className="examples"
              eventKey={i}
              onClick={() => {
                const exConf = activityType.meta.exampleData[i].config;
                setConfig(exConf);
                setReloadAPIform(uuid());
                initActivityDocuments(instances, activityType, i, exConf, true);
                initDashboardDocuments(activityType, true);
                setExample(i);
              }}
            >
              {x.title}
            </NavItem>
          ))}
      </Nav>
    </div>
  );
};
