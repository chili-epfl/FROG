// @flow

import { compact, range } from 'lodash';
import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import { meta } from './meta';
import dashboard from './Dashboard';

const getNum = x => parseInt(x.split(' ').pop(), 10);

const exportData = (config, { activityData: { payload } }) => {
  const csv = Object.keys(payload).map(line => {
    const data = payload[line].data['form'];
    const res = [];
    if (data) {
      Object.keys(data).map(q => {
        const num = getNum(q);
        res[num] = data[q];
      });
      return [line, ...res].join('\t');
    }
  });

  console.log(config, config.questions);
  const headers = [
    'instanceId',
    ...range(config.questions.length).map(x => 'q' + (x + 1))
  ].join('\t');
  return compact([headers, ...csv.sort()]).join('\n');
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
