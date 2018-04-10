// @flow

import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import { uuid } from 'frog-utils';

import Icon from './Icon';
import {
  initDashboardDocuments,
  hasDashExample,
  Logs
} from './dashboardInPreviewAPI';
import { initActivityDocuments } from './Content';
import { activityTypesObj } from '../../activityTypes';
import { addDefaultExample } from './index';

const names = 'Chen Li,Maurice,Edgar,Noel,Ole,Stian,Jenny,Prastut,Louis'.split(
  ','
);

export default (props: Object) => {
  const {
    activityTypeId,
    instances,
    config,
    dismiss,
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
    setActivityTypeId,
    setExample,
    plane,
    users,
    setUsers,
    setPlane,
    setInstances
  } = props;
  const activityType = activityTypesObj[activityTypeId];
  if (!activityType) {
    return <p>Choose and activityType</p>;
  }
  const examples = addDefaultExample(activityType);
  const ex = showDashExample ? activityType.dashboard.exampleLogs : examples;

  const refresh = () => {
    initActivityDocuments(instances, activityType, example, config, true);
    // resets the reactive documents for the dashboard
    initDashboardDocuments(activityType, true);
    Logs.length = 0;
  };

  const _dismiss = () => {
    setFullWindow(false);
    if (dismiss) {
      dismiss();
    } else {
      setActivityTypeId(null);
      setExample(0);
      setConfig({});
      setReloadAPIform(uuid());
      Logs.length = 0;
    }
  };

  const add = () => {
    const newName = names[users.length % names.length];
    const newGroup = 1 + Math.floor(users.length / 2);
    setUsers([...users, newName]);
    setInstances([...instances, [undefined, newGroup, 'all'][plane - 1]]);
  };
  const remove = () => {
    setUsers(users.slice(0, users.length - 1));
    setInstances(instances.slice(0, instances.length - 1));
  };
  const groupName = idx => 'group' + (1 + Math.floor(idx / 2));
  const switchPlane = () => {
    const newPlane = 1 + plane % 3;
    setPlane(newPlane);
    setInstances(
      users.map((name, idx) => [undefined, groupName(idx), 'all'][newPlane - 1])
    );
  };

  return (
    <div className="bootstrap modal-header" style={{ overflow: 'auto' }}>
      <button
        type="button"
        onClick={_dismiss}
        className="btn btn-danger btn-large"
        style={{ float: 'right', margin: '5px' }}
        data-tip="Close, and show list of activity types to preview"
      >
        X
      </button>
      <h4 className="modal-title">
        Preview
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
          onClick={add}
          icon="fa fa-user-plus"
          color="#3d76b8"
          tooltip="Add a user"
        />
        <Icon
          onClick={remove}
          icon="fa fa-user-times"
          color={users.length > 1 ? '#3d76b8' : '#b3cae6'}
          tooltip="Remove one user"
        />
        <Icon
          onClick={switchPlane}
          icon={
            ['fa fa-user-circle-o', 'fa fa-users', 'fa fa-university'][
              plane - 1
            ]
          }
          color="#3d76b8"
          tooltip="Change plane"
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
      </h4>
      {ex && (
        <Nav bsStyle="pills" activeKey={example}>
          {ex.map((x, i) => (
            <NavItem
              key={x.title}
              className="examples"
              eventKey={i}
              onClick={() => {
                const exConf = addDefaultExample(activityType)[i].config;
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
      )}
    </div>
  );
};
