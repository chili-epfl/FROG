// @flow

import * as React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { cloneDeep } from 'lodash';
import { getInitialState } from 'frog-utils';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import { createLogger, DashPreviewWrapper } from './dashboardInPreviewAPI';
import ShowDashExample from './ShowDashExample';

import { Collections, connection } from './Preview';

export default ({
  showDashExample,
  plane,
  instances,
  config,
  examples,
  example,
  activityType,
  showLogs,
  showData,
  users,
  reload,
  externalReload,
  showDash
}: Object) => {
  if (!activityType) {
    return <p>Choose an activityType</p>;
  }
  if (!users || !instances) {
    return <p>There is no user</p>;
  }
  if (config && config.invalid) {
    return <p>The config is invalid</p>;
  }

  const uniqueInstances = instances.filter(
    (ins, idx) => instances.indexOf(ins) === idx
  );

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType.id;
  const activityData = examples[example] ? cloneDeep(examples[example]) : {};
  if (config) {
    activityData.config = config;
  }

  const Run = ({ name, idx, instance }) => {
    const ActivityToRun = ReactiveHOC(Collections[instance], connection)(
      showData ? ShowInfo : RunComp
    );
    return (
      <ActivityToRun
        activityType={activityType.id}
        activityData={activityData}
        userInfo={{ name, idx }}
        stream={() => undefined}
        logger={createLogger(
          'preview',
          instance,
          activityType.id,
          'preview',
          '' + idx,
          plane,
          activityData.config
        )}
        groupingValue={instance}
      />
    );
  };
  return (
    <div
      className="modal-body"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 60px)'
      }}
    >
      {showDashExample ? (
        <ShowDashExample
          example={example}
          activityType={activityType}
          showLogs={showLogs}
        />
      ) : users.length === 1 && !showDash ? (
        <Run name={users[0]} idx={0} instance={instances[0]} />
      ) : (
        <Mosaic
          renderTile={([name, idx, instance], path) =>
            name === 'dashboard' && activityType.dashboard ? (
              <MosaicWindow
                title={'dashboard - ' + activityType.meta.name}
                path={path}
              >
                <DashPreviewWrapper
                  config={activityData.config}
                  instances={uniqueInstances}
                  users={users}
                  activityType={activityType}
                />
              </MosaicWindow>
            ) : (
              <MosaicWindow
                path={path}
                reload={reload + externalReload}
                example={example}
                title={name + '/' + instance + ' - ' + activityType.meta.name}
              >
                <Run name={name} idx={idx} instance={instance} />
              </MosaicWindow>
            )
          }
          initialValue={getInitialState(
            showDash
              ? [
                  ['dashboard'],
                  ...users.map((name, idx) => [name, idx, instances[idx]])
                ]
              : users.map((name, idx) => [name, idx, instances[idx]])
          )}
        />
      )}
    </div>
  );
};
