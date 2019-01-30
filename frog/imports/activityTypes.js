// @flow

import importAll from 'import-all.macro';
import { keyBy } from 'lodash';
import {
  type ActivityPackageT,
  entries,
  values,
  type LearningItemT
} from 'frog-utils';

import { operatorTypes } from './operatorTypes';

const packagesRaw = importAll.sync('../node_modules/ac-*/src/index.js');
export const activityTypesExt = entries(packagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

const internal = importAll.sync('./internalActivities/*/index.js');

const internalLIs = importAll.sync('./internalLearningItems/*/index.js');

export const activityTypesObj: { [at: string]: ActivityPackageT } = entries(
  internal
).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  activityTypesExt
);

export const activityTypes: ActivityPackageT[] = values(activityTypesObj);

const packageLIs = [...activityTypes, ...operatorTypes].reduce(
  (acc, x) => acc.concat(x.LearningItems || []),
  []
);

export const learningItemTypesObj: {
  [name: string]: LearningItemT<any>
} = keyBy(
  values(internalLIs)
    .map(x => x.default)
    .map(x => {
      x.config = {
        ...activityTypesObj['ac-single-li'],
        meta: { name: x.name },
        config: {
          properties: {
            ...activityTypesObj['ac-single-li'].config.properties,
            liTypeEditor: { type: 'string', default: x.id }
          }
        }
      };
      return x;
    })
    .concat(packageLIs),
  'id'
);

Object.keys(learningItemTypesObj).forEach(li => {
  activityTypesObj[li] = learningItemTypesObj[li];
});

activityTypes.push(...values(learningItemTypesObj));

console.log(activityTypesObj, activityTypes);
