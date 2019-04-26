import importAll from 'import-all.macro';
import { keyBy, omit } from 'lodash';
import {
  type ActivityPackageT,
  entries,
  values,
  type LearningItemT,
  cloneDeep
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

console.log(internalLIs,packageLIs)
export const learningItemTypesObj: {
  [name: string]: LearningItemT<any>
} = keyBy(
  values(internalLIs)
    .map(x => x.default)
    .concat(packageLIs),
  'id'
);

const activityLIs = cloneDeep(learningItemTypesObj);
Object.keys(activityLIs).forEach(li => {
  const x = activityLIs[li];
  if (!(x.Creator || (x.liDataStructure && x.Editor))) {
    delete activityLIs[li];
  }
});

Object.values(activityLIs).forEach(x => {
  x.meta = {
    name: x.name,
    shortDesc: '',
    description: '',
    supportsLearningItems: true,
    category: 'Single Learning Items'
  };
  x.mergeFunction = activityTypesObj['ac-single-li'].mergeFunction;
  x.formatProduct = activityTypesObj['ac-single-li'].formatProduct;
  x.configUI = activityTypesObj['ac-single-li'].configUI;
  x.configVersion = 1;
  x.dataStructure = {};
  x.config = {
    type: 'object',
    properties: {
      ...omit(
        activityTypesObj['ac-single-li'].config.properties,
        'duplicateLI'
      ),
      submit: { title: 'Have a submit button', type: 'boolean' },
      liTypeEditor: { type: 'string', default: x.id },
      openIncomingInEdit: { type: 'boolean', default: true }
    }
  };
});

Object.keys(activityLIs).forEach(li => {
  activityTypesObj[li] = activityLIs[li];
});

activityTypes.push(...values(activityLIs));
