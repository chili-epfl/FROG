// @flow

import importAll from 'import-all.macro';
import Loadable from 'react-loadable';
import { keyBy } from 'lodash';
import { Meteor } from 'meteor/meteor';

import {
  type ActivityPackageT,
  entries,
  values,
  type LearningItemT
} from 'frog-utils';
import { operatorTypes } from './operatorTypes';

const isResearcher =
  Meteor.isServer || (localStorage && localStorage.getItem('isResearcher'));
const isExperimental = acPkg => acPkg.meta.experimental === true;

const packagesRaw = importAll.sync('../node_modules/ac-*/src/index.js');
const activityTypesExt = entries(packagesRaw)
  .filter(([_, v]) => isResearcher || !isExperimental(v.default))
  .reduce((acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }), {});

const internal = importAll.sync('./internalActivities/*/index.js');

export const activityTypesObj: { [at: string]: ActivityPackageT } = entries(
  internal
)
  .filter(([_, v]) => isResearcher || !isExperimental(v.default))
  .reduce(
    (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
    activityTypesExt
  );

export const activityTypes: ActivityPackageT[] = values(activityTypesObj);

const activityRunnersRaw = importAll.deferred(
  '../node_modules/ac-*/src/ActivityRunner?(.js)'
);
const activityRunnersExt = entries(activityRunnersRaw).reduce(
  (acc, [k, v]) => ({
    ...acc,
    [k.split('/')[2]]: Loadable({
      loader: v,
      loading: () => null,
      serverSideRequirePath: k
    })
  }),
  {}
);

const activityRunnersRawInternal = importAll.deferred(
  './internalActivities/*/ActivityRunner?(.js)'
);

export const activityRunners = entries(activityRunnersRawInternal).reduce(
  (acc, [k, v]) => ({
    ...acc,
    [k.split('/')[2]]: Loadable({
      loader: v,
      loading: () => null,
      serverSideRequirePath: k
    })
  }),
  activityRunnersExt
);

const internalLIs = importAll.sync('./internalLearningItems/*/index.js');

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
