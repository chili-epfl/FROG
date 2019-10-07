// @flow

import importAll from 'import-all.macro';
import {
  Loadable,
  entries,
  values,
  type operatorPackageT,
  type ActivityPackageT,
  type LearningItemT
} from '/imports/frog-utils';
import { keyBy } from 'lodash';

// we're duplicating a lot of logic here from ../activityTypes and ../operatorTypes, because
// there was an issue with circular imports leading to import { activityTypesObj } from '../activityTypes'
// to be undefined

const activityRunnersRaw = importAll.deferred(
  '../../node_modules/ac-*/src/ActivityRunner?(.js)'
);
export const activityRunnersExt = entries(activityRunnersRaw).reduce(
  (acc, [k, v]) => {
    const ac = k.split('/')[3];
    return {
      ...acc,
      [ac]: Loadable({
        loader: v,
        loading: () => null,
        serverSideRequirePath: k,
        componentDescription: ac
      })
    };
  },
  {}
);

const activityRunnersRawInternal = importAll.deferred(
  '../internalActivities/*/client/ActivityRunner?(.js)'
);

export const activityRunners = entries(activityRunnersRawInternal).reduce(
  (acc, [k, v]) => {
    const ac = k.split('/')[2];
    return {
      ...acc,
      [ac]: Loadable({
        loader: v,
        loading: () => null,
        serverSideRequirePath: k,
        componentDescription: ac
      })
    };
  },
  activityRunnersExt
);

const operatorPackagesRaw = importAll.sync(
  '../../node_modules/op-*/src/index.js'
);

export const operatorTypesObj = entries(operatorPackagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[3]]: v.default }),
  {}
);
export const operatorTypes: operatorPackageT[] = values(operatorTypesObj);

const packagesRaw = importAll.sync('../../node_modules/ac-*/src/index.js');
export const activityTypesExt = entries(packagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[3]]: v.default }),
  {}
);

const internal = importAll.sync('../internalActivities/*/index.js');

export const activityTypesObj: { [at: string]: ActivityPackageT } = entries(
  internal
).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  activityTypesExt
);

export const activityTypes: ActivityPackageT[] = values(activityTypesObj);

const internalLIs = importAll.sync('../internalLearningItems/*/index.js');

const packageLIs = [...activityTypes, ...operatorTypes].reduce(
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

Object.keys(learningItemTypesObj).forEach(li => {
  activityRunners[li] = activityRunners['ac-single-li'];
});
