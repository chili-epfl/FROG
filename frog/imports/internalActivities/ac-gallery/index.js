// @flow

import { type ActivityPackageT, uuid } from '/imports//imports/frog-utils';
import { compact, isEmpty, isObject, values } from 'lodash';

import dashboards from './Dashboard';
import { meta } from './meta';
import { config, configUI } from './config';
import upgradeFunctions from './upgradeFunctions';

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (isEmpty(object.data) || !isObject(object.data)) {
    return;
  }
  values(object.data).forEach(v => {
    const id = uuid();
    if (v.li) {
      dataFn.objInsert(
        {
          id,
          votes: v.votes || {},
          categories: v.categories || (v.category && [v.category]),
          comment: v.comment || '',
          username: v.username,
          userId: v.userId,
          li: v.li
        },
        id
      );
    }
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
  configVersion: 1,
  meta,
  config,
  upgradeFunctions,
  configUI,
  dataStructure,
  mergeFunction,
  dashboards,
  exportData
}: ActivityPackageT);
