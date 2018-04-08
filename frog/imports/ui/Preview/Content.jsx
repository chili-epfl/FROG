// @flow

import * as React from 'react';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import { cloneDeep } from 'lodash';
import { getInitialState, generateReactiveFn } from 'frog-utils';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import { createLogger, DashPreviewWrapper } from './dashboardInPreviewAPI';
import ShowDashExample from './ShowDashExample';
import { activityTypesObj } from '../../activityTypes';
import { connection } from './Preview';

const DocId = (acId, instance) => ('preview/' + acId +  '/' + instance)

export const initActivityDocuments = (
  instances: string[],
  activityType: Object,
  example: number,
  config: Object,
  refresh: boolean
) => {
  console.log('initActivityDocuments', activityType)
  instances.forEach(instance => {
    const runMergeFunction = _doc => {
      const mergeFunction = activityType.mergeFunction;
      if (mergeFunction) {
        const dataFn = generateReactiveFn(_doc);
        const exs = activityType.meta.exampleData;
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

export default ({
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
  if (config === undefined || config.invalid) {
    return <p>The config is invalid</p>;
  }

  const uniqueInstances = instances.filter(
    (ins, idx) => instances.indexOf(ins) === idx
  );

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType.id;

  const examples = activityType.meta.exampleData || [];
  const { data } =
    example > -1 && examples[example] ? cloneDeep(examples[example]) : {};
  const activityData = { data, config };

  const Run = ({ name, idx, instance }) => {
    const docId = DocId(activityType.id, instance)
    const ActivityToRun = ReactiveHOC(docId, connection)(
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
                reload={JSON.stringify(config)}
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
