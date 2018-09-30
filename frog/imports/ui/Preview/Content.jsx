// @flow

import * as React from 'react';
import { compose, toClass } from 'recompose';
import { uniq } from 'lodash';

import {
  MosaicWithoutDragDropContext,
  MosaicWindow
} from 'react-mosaic-component';
import {
  cloneDeep,
  getInitialState,
  Doc,
  withDragDropContext,
  uuid
} from 'frog-utils';

import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import { createLogger, DashPreviewWrapper } from './dashboardInPreviewAPI';
import ShowDashExample from './ShowDashExample';
import { activityRunners, activityTypesObj } from '../../activityTypes';
import { connection } from './Preview';
import { addDefaultExample } from './index';
import { getUserId } from './Controls';
import LearningItem from '../LearningItem';

const DocId = (acId, instance) => 'preview-' + acId + '/' + instance;

export const generateDataFn = () => {
  const doc = connection.get('li', uuid());
  return new Doc(doc, { LearningItem });
};

export const initActivityDocuments = (
  instances: string[],
  activityType: Object,
  example: number,
  config: Object,
  refresh: boolean
) => {
  const exs = addDefaultExample(activityType);
  if (exs[example].learningItems) {
    exs[example].learningItems.forEach(li => {
      const doc = connection.get('li', li.id);
      if (doc.type) {
        doc.submitOp({ p: [], oi: li });
      } else {
        doc.create(li);
      }
    });
  }
  uniq(instances).forEach(instance => {
    const runMergeFunction = _doc => {
      const mergeFunction = activityType.mergeFunction;
      if (mergeFunction) {
        const dataFn = new Doc(_doc, { LearningItem });
        const initData =
          typeof activityType.dataStructure === 'function'
            ? activityType.dataStructure(config)
            : activityType.dataStructure;
        const data =
          example === -1 || example === undefined
            ? cloneDeep(initData)
            : exs[example].data;
        mergeFunction(cloneDeep({ data, config }), dataFn, dataFn.doc.data);
      }
    };

    const doc = connection.get('rz', DocId(activityType.id, instance));
    doc.fetch();
    if (!doc.type) {
      doc.once('load', () => {
        if (!doc.type) {
          const initData =
            typeof activityType.dataStructure === 'function'
              ? activityType.dataStructure(config)
              : activityType.dataStructure;
          doc.create(cloneDeep(initData) || {});
          runMergeFunction(doc);
        }
      });
    } else if (refresh) {
      const dataFn = new Doc(doc, { LearningItem });

      const initData =
        typeof activityType.dataStructure === 'function'
          ? activityType.dataStructure(config)
          : activityType.dataStructure;
      dataFn.objInsert(cloneDeep(initData) || {}, []);
      runMergeFunction(doc);
    }
  });
};

const ContentController = ({
  showDashExample,
  plane,
  instances,
  config,
  example,
  activityTypeId,
  showLogs,
  showData,
  users,
  reloadActivity,
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

  const RunComp = activityRunners[activityType.id];
  RunComp.displayName = activityType.id;

  const examples = activityType.meta.exampleData || [];
  const exData = examples[example] && cloneDeep(examples[example]);
  const data = exData && (exData.data ? exData.data : undefined);
  const activityData = { data, config };

  const Run = ({ name, instance }) => {
    if (activityType.meta.preview === false) {
      return <h1>No preview available for this activity type</h1>;
    }
    const docId = DocId(activityType.id, instance);
    const formatProduct = activityType.formatProduct;

    const transform = formatProduct
      ? x => formatProduct(config || {}, x, instance, name)
      : undefined;

    const ActivityToRun = ReactiveHOC(docId, {
      conn: connection,
      transform
    })(showData ? ShowInfo : RunComp);

    const logger = createLogger(
      'preview',
      instance,
      activityType.id,
      activityType.id,
      getUserId(name),
      plane,
      config
    );
    logger({ type: 'activityDidMount' });
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <ActivityToRun
          activityType={activityType.id}
          key={reloadActivity}
          activityData={activityData}
          activityId="preview"
          userInfo={{ name, id: getUserId(name) }}
          stream={() => undefined}
          logger={logger}
          groupingValue={instance}
          sessionId={reloadActivity}
        />
      </div>
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
    <div style={{ height: '100%' }}>
      {showDashExample ? (
        <ShowDashExample
          example={example}
          activityType={activityType}
          showLogs={showLogs}
        />
      ) : users.length === 1 && !showDash ? (
        <Run name={users[0]} idx={0} instance={instances[0]} />
      ) : (
        <MosaicWithoutDragDropContext
          renderTile={([name, instance], path) =>
            name === 'dashboard' && activityType.dashboards ? (
              <MosaicWindow
                title={'dashboard - ' + activityType.meta.name}
                toolbarControls={[<div key={instance} />]}
                key={JSON.stringify({ config, showData })}
                path={path}
              >
                <Dashboard />
              </MosaicWindow>
            ) : (
              <MosaicWindow
                path={path}
                toolbarControls={[<div key={instance} />]}
                key={JSON.stringify({ config, showData, reloadActivity })}
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
                  ['dashboard', 'dashboard'],
                  ...users.map((name, idx) => [name, instances[idx]])
                ]
              : users.map((name, idx) => [name, instances[idx]])
          )}
        />
      )}
    </div>
  );
};

const Content = compose(
  withDragDropContext,
  toClass
)(ContentController);

export default Content;
