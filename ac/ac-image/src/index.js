// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';
import { compact, isEmpty } from 'lodash';

import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';
import { meta } from './meta';
import { config, configUI } from './config';

export const DEFAULT_COMMENT_VALUE = '';

const dataStructure = {};

const mergeFunction = (object, dataFn) => {
  if (object.config.images)
    object.config.images.forEach((x, i) =>
      dataFn.objInsert({ votes: {}, comment: DEFAULT_COMMENT_VALUE, ...x }, i)
    );

  if (object.data === null || object.data === {} || object.data === undefined)
    return;
  const dataImgs = Array.isArray(object.data)
    ? object.data
    : Object.keys(object.data).map(x => object.data[x]);
  dataImgs.forEach(x =>
    dataFn.objInsert(
      {
        votes: {},
        categories: x.categories || (x.category && [x.category]),
        comment: DEFAULT_COMMENT_VALUE,
        ...x
      },
      x.key || uuid()
    )
  );
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
  id: 'ac-image',
  type: 'react-component',
  meta,
  config,
  configUI,
  dataStructure,
  mergeFunction,
  ActivityRunner,
  dashboard,
  exportData
}: ActivityPackageT);
