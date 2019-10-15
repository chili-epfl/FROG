// @flow

import importAll from 'import-all.macro';
import { keyBy, omit } from 'lodash';
import {
  type ActivityPackageT,
  entries,
  values,
  type LearningItemT,
  cloneDeep
} from '/imports/frog-utils';

import { operatorTypes } from './operatorTypes';

const packagesRaw = importAll.sync('../node_modules/ac-*/src/index.js');
const internal = importAll.sync('./internalActivities/*/index.js');
const internalLIs = importAll.sync('./internalLearningItems/*/index.js');

export const activityTypesObj: { [at: string]: ActivityPackageT } = [
  ...entries(packagesRaw),
  ...entries(internal)
].reduce((acc, [k, v]) => {
  acc[k.split('/')[2]] = v.default;
  return acc;
}, {});

const packageLIs = [...values(activityTypesObj), ...operatorTypes].reduce(
  (acc, x) => acc.concat(x.LearningItems || []),
  []
);

export const learningItemTypesObj: {
  [name: string]: LearningItemT<any>
} = keyBy(
  values(internalLIs)
    .map(x => x.default)
    .concat(packageLIs),
  'id'
);

const acSingleLI = activityTypesObj['ac-single-li'];
const activityLIs = entries(learningItemTypesObj)
  .filter(([_, v]) => v.Creator || (v.dataStructure && v.Editor))
  .reduce((acc, [k, v]) => {
    const x = cloneDeep(v);
    x.meta = {
      name: x.name,
      shortDesc: '',
      description: '',
      supportsLearningItems: true,
      category: 'Single Learning Items'
    };
    x.mergeFunction = acSingleLI.mergeFunction;
    x.formatProduct = acSingleLI.formatProduct;
    x.configUI = acSingleLI.configUI;
    x.configVersion = 1;
    x.dataStructure = {};
    x.config = {
      type: 'object',
      properties: {
        ...omit(acSingleLI.config.properties, 'duplicateLI'),
        submit: { title: 'Have a submit button', type: 'boolean' },
        liTypeEditor: { type: 'string', default: x.id },
        openIncomingInEdit: { type: 'boolean', default: true }
      }
    };
    acc[k] = x;
    return acc;
  }, {});

Object.keys(activityLIs).forEach(li => {
  activityTypesObj[li] = activityLIs[li];
});

export const activityTypes: ActivityPackageT[] = values(activityTypesObj);
