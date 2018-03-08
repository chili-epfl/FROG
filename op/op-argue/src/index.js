// @flow

import { shuffle, chunk } from 'lodash';
import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Argue',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {}
};

const optim = (values) => values.reduce((acc,x) => acc + Math.sqrt(x), 0)

const operator = (configData, object) => {
  console.log('OP-ARGUE')
  console.log(object)
  const { activityData: { payload } } = object;
  const { instances, distanceMatrix } = payload.all.data

  console.log('STEP1')

  if (instances.length === 1) return { group: { '1': [ instances[0] ] } };

  const last = instances.length % 2 ? instances.pop() : null;

  const tmp = chunk([...instances.keys()], 2);

  console.log(tmp)
  console.log('STEP2')

  let modified = true
  while (modified) {
    modified = false;


    for (let i = 0; i < tmp.length && !modified; i = 1 + i) {


      for (let j = i+1; j < tmp.length && !modified; j = 1 + j) {
        if (
          optim([distanceMatrix[tmp[i][0]][tmp[j][0]], distanceMatrix[tmp[i][1]][tmp[j][1]]] > dP1
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][0];
          tmp[j][0] = k;
          modified = true;
        } else if (
          Math.min(
            distanceMatrix[tmp[i][0]][tmp[j][1]],
            distanceMatrix[tmp[i][1]][tmp[j][0]]
          ) > dP1
        ) {
          const k = tmp[i][1];
          tmp[i][1] = tmp[j][1];
          tmp[j][1] = k;
          modified = true;
        }
      }




    }
  };

  if (last) {
    tmp[0].push(instances.length-1);
  }

  const result = { group: {} };

  for (let i = 0; i < tmp.length; i = 1 + i) {
    tmp[i].sort((a, b) => a - b);
    result.group[(i + 1).toString()] = tmp[i].map(x => instances[x]);
  }
  return result;
};

export default ({
  id: 'op-argue',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);































function s_DataCollectionCreation(){
  sumup = {}
  for (let i = 0; i < s_analyticsDomain.length-1; i++) {
    if(!sumup[s_analyticsDomain[i]]) {
      sumup[s_analyticsDomain[i]] = {
        nameAnalyticsDomain: s_analyticsDomain[i],
        ShortTitles: {
          [s_shortTitle[i]]: {
            nameShortTitle: s_shortTitle[i],
            DPIDS: [s_DPID[i]]
          }
        }
      }
    } else {
      if(!sumup[s_analyticsDomain[i]].ShortTitles[s_shortTitle[i]]) {
        sumup[s_analyticsDomain[i]].ShortTitles[s_shortTitle[i]] = {
          nameShortTitle: s_shortTitle[i],
          DPIDS: [s_DPID[i]]
        }
      } else {
        sumup[s_analyticsDomain[i]].ShortTitles[s_shortTitle[i]].DPIDs.push(s_DPID[i])
      }
    }
  }
}
