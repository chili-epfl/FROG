// @flow

import * as React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { cloneDeep, getInitialState, generateReactiveFn } from 'frog-utils';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import { createLogger, DashPreviewWrapper } from './dashboardInPreviewAPI';
import ShowDashExample from './ShowDashExample';
import { activityTypesObj } from '../../activityTypes';
import { connection } from './Preview';
import { addDefaultExample } from './index';
import { getUserId } from './Controls';

const DocId = (acId, instance) => 'preview/' + acId + '/' + instance;

export const initActivityDocuments = (
  instances: string[],
  activityType: Object,
  example: number,
  config: Object,
  refresh: boolean
) => {
  instances.forEach(instance => {
    const runMergeFunction = _doc => {
      const mergeFunction = activityType.mergeFunction;
      if (mergeFunction) {
        const dataFn = generateReactiveFn(_doc);
        const exs = addDefaultExample(activityType);
        const data =
          example === -1 || example === undefined
            ? cloneDeep(activityType.dataStructure)
            : exs[example].data;
        mergeFunction(cloneDeep({ data, config }), dataFn);
      }
    };

    const doc = connection.get('rz', DocId(activityType.id, instance));
    doc.fetch();
    if (!doc.type) {
      doc.once('load', () => {
        if (!doc.type) {
          doc.create(cloneDeep(activityType.dataStructure) || {});
          runMergeFunction(doc);
        }
      });
    } else if (refresh) {
      const dataFn = generateReactiveFn(doc);
      dataFn.objInsert(cloneDeep(activityType.dataStructure) || {}, []);
      runMergeFunction(doc);
    }
  });
};

const Content = ({
  showDashExample,
  plane,
  instances,
  config,
  example,
  activityTypeId,
  showLogs,
  showData,
  users,
  showDash
}: Object) => {
  const activityType = activityTypesObj[activityTypeId];

  if (!activityType) {
    return <p>Choose an activityType</p>;
  }
  if (!users || !instances) {
    return <p>There is no user</p>;
  }
  if (!showDashExample && (config === undefined || config.invalid)) {
    return <p>The config is invalid</p>;
  }

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType.id;

  const examples = activityType.meta.exampleData || [];
  const { data } =
    example > -1 && examples[example] ? cloneDeep(examples[example]) : {};
  const activityData = { data, config };

  const Run = ({ name, instance }) => {
    const docId = DocId(activityType.id, instance);
    const ActivityToRun = ReactiveHOC(docId, connection)(
      showData ? ShowInfo : RunComp
    );
    return (
      <ActivityToRun
        activityType={activityType.id}
        activityData={activityData}
        userInfo={{ name, id: getUserId(name) }}
        stream={() => undefined}
        logger={createLogger(
          'preview',
          instance,
          activityType.id,
          'preview',
          getUserId(name),
          plane
        )}
        groupingValue={instance}
      />
    );
  };

  const Dashboard = () => (
    <DashPreviewWrapper
      config={activityData.config}
      instances={instances}
      users={users.reduce((acc, x) => ({ ...acc, [getUserId(x)]: x }), {})}
      activityType={activityType}
      showData={showData}
      plane={plane}
    />
  );

  return (
    <div
      className="modal-body"
      style={{
        position: 'relative',
        width: 'calc(100% - 30px)',
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
          renderTile={([name, instance], path) =>
            name === 'dashboard' && activityType.dashboards ? (
              <MosaicWindow
                title={'dashboard - ' + activityType.meta.name}
                key={JSON.stringify({ config, showData })}
                path={path}
              >
                <Dashboard />
              </MosaicWindow>
            ) : (
              <MosaicWindow
                path={path}
                key={JSON.stringify({ config, showData })}
                title={
                  name +
                  '/' +
                  ['individual', instance, 'all'][plane - 1] +
                  ' - ' +
                  activityType.meta.name
                }
              >
                <Run name={name} instance={instance} />
              </MosaicWindow>
            )
          }
          initialValue={getInitialState(
            showDash
              ? [
                  ['dashboard'],
                  ...users.map((name, idx) => [name, instances[idx]])
                ]
              : users.map((name, idx) => [name, instances[idx]])
          )}
        />
      )}
    </div>
  );
};

export default Content;
