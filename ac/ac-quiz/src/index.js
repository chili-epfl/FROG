// @flow

import { compact, range } from 'lodash';
import Stringify from 'json-stringify-pretty-compact';
import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import { meta } from './meta';
import dashboard from './Dashboard';

const getNum = x => parseInt(x.split(' ').pop(), 10);

const exportData = (config, product) => {
  const csv = Object.keys(product.payload).map(line => {
    const data = product.payload[line].data['form'];
    const res = [];
    if (data) {
      Object.keys(data).map(q => {
        const num = getNum(q);
        res[num] = data[q];
      });
      return [line, ...res];
    }
  });

  const headers =
    'instanceId,' +
    range(config.questions.length)
      .map(x => 'q' + (x + 1))
      .join(',');
  console.log(Stringify(config));
  return compact([headers, ...csv]).join('\n');
};

export default ({
  id: 'ac-quiz',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  exportData
}: ActivityPackageT);
