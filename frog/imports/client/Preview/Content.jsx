// @flow

import * as React from 'react';
import { uniq } from 'lodash';
import { toJS } from 'mobx';

import {
  ActivitySplitWindow,
  ActivityWindow
} from '/imports/ui/ActivitySplitWindow';
import { cloneDeep, uuid } from '/imports/frog-utils';

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import LearningItem from '/imports/client/LearningItem';
import { activityTypesObj } from '/imports/activityTypes';
import { activityRunners } from '/imports/client/activityRunners';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import ShowInfo from './ShowInfo';
import { createLogger, DashPreviewWrapper } from './dashboardInPreviewAPI';
import ShowDashExample from './ShowDashExample';
import { connection, backend } from './Preview';
import { addDefaultExample } from './index';
import { getUserId } from './Controls';

export const DocId = (acId: string, instance: string) =>
  'preview-' + acId + '/' + instance;

export const generateDataFn = () => {
  const doc = connection.get('li', uuid());
  return generateReactiveFn(
    doc,
    LearningItem,
    undefined,
    undefined,
    undefined,
    backend
  );
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
        const dataFn = generateReactiveFn(
          _doc,
          LearningItem,
          undefined,
          undefined,
          undefined,
          backend
        );
        const initData =
          typeof activityType.dataStructure === 'function'
            ? activityType.dataStructure(toJS(config))
            : activityType.dataStructure;
        const data =
          example === -1 || example === undefined
            ? cloneDeep(initData)
            : exs[example].data;
        mergeFunction(
          cloneDeep({ data, config: toJS(config) }),
          dataFn,
          dataFn.doc.data
        );
      }
    };

    const doc = connection.get('rz', DocId(activityType.id, instance));
    doc.fetch();
    if (!doc.type) {
      doc.once('load', () => {
        if (!doc.type) {
          const initData =
            typeof activityType.dataStructure === 'function'
              ? activityType.dataStructure(toJS(config))
              : activityType.dataStructure;
          doc.create(cloneDeep(initData) || {});
          runMergeFunction(doc);
        }
      });
    } else if (refresh) {
      const dataFn = generateReactiveFn(
        doc,
        LearningItem,
        undefined,
        undefined,
        undefined,
        backend
      );

      const initData =
        typeof activityType.dataStructure === 'function'
          ? activityType.dataStructure(toJS(config))
          : activityType.dataStructure;
      dataFn.objInsert(cloneDeep(initData) || {}, []);
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

  const acRunnerId = activityType.id.startsWith('li-')
    ? 'ac-single-li'
    : activityType.id;
  const RunComp = activityRunners[acRunnerId];
  if (!RunComp) {
    return <h1>No activity runner available for this activity type</h1>;
  }
  RunComp.displayName = activityType.id;

  const examples = addDefaultExample(activityType);
  const exData = examples[example] && cloneDeep(examples[example]);
  const data = exData && (exData.data ? exData.data : undefined);
  const activityData = { data, config: toJS(config) };

  const Run = ({ name, instance }) => {
    if (activityType.meta.preview === false) {
      return <h1>No preview available for this activity type</h1>;
    }
    const docId = DocId(activityType.id, instance);
    const formatProduct = activityType.formatProduct;

    const transform = formatProduct
      ? x => formatProduct(toJS(config) || {}, x, instance, name, {}, plane)
      : undefined;

    const ActivityToRun = ReactiveHOC(
      docId,
      connection,
      false,
      undefined,
      { createdByUser: getUserId(name) },
      backend,
      undefined,
      undefined,
      transform
    )(showData ? ShowInfo : RunComp);

    const logger = createLogger(
      'preview',
      instance,
      activityType.id,
      activityType.id,
      getUserId(name),
      plane,
      toJS(config)
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

  const renderElement = (name, instance) => {
    return name === 'dashboard' && activityType.dashboards ? (
      <ActivityWindow
        title={'dashboard - ' + activityType.meta.name}
        key={JSON.stringify({ config, showData })}
      >
        <Dashboard />
      </ActivityWindow>
    ) : (
      <ActivityWindow
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
      </ActivityWindow>
    );
  };

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
        <ActivitySplitWindow>
          {showDash
            ? [
                ['dashboard', 'dashboard'],
                ...users.map((name, idx) => [name, instances[idx]])
              ].map(([name, instance]) => {
                return renderElement(name, instance);
              })
            : users
                .map((name, idx) => [name, instances[idx]])
                .map(([name, instance]) => {
                  return renderElement(name, instance);
                })}
        </ActivitySplitWindow>
      )}
    </div>
  );
};

export default Content;
