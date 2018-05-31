// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';
import { compact, isEmpty, isObject, values } from 'lodash';

import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboard';
import { meta } from './meta';
import { config, configUI } from './config';

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (isEmpty(object.data) || !isObject(object.data)) {
    return;
  }
  values(object.data).forEach(v => {
    const id = uuid();
    dataFn.objInsert(
      {
        id,
        votes: v.votes || {},
        categories: v.categories || (v.category && [v.category]),
        comment: v.comment || '',
        li: v.li
      },
      id
    );
  });
};

const exportData = (configData, { payload }) => {
  const csv = Object.keys(payload).reduce((acc, line) => {
    const data = payload[line].data;
    return [
      ...acc,
      ...compact(
        Object.values(data).map(
          item =>
            typeof item === 'object' &&
            item &&
            item.key &&
            [
              line,
              item.key,
              item.instanceId,
              JSON.stringify(item.comment),
              isEmpty(item.categories) ? '' : JSON.stringify(item.categories),
              isEmpty(item.votes) ? '' : JSON.stringify(item.votes)
            ].join('\t')
        )
      )
    ];
  }, []);

  const headers = [
    'instanceId',
    'imageId',
    'fromInstanceId',
    'comment',
    'categories',
    'votes'
  ].join('\t');
  return [headers, ...csv].join('\n');
};

export default ({
  id: 'ac-gallery',
  type: 'react-component',
  meta,
  config,
  configUI,
  dataStructure,
  mergeFunction,
  ActivityRunner,
  dashboards,
  exportData
}: ActivityPackageT);
