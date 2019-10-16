// @flow

import importAll from 'import-all.macro';
import { Loadable, entries } from '/imports/frog-utils';

// we're duplicating a lot of logic here from ../activityTypes and ../operatorTypes, because
// there was an issue with circular imports leading to import { activityTypesObj } from '../activityTypes'
// to be undefined

const activityRunnersRaw = importAll.deferred(
  '../../node_modules/ac-*/src/ActivityRunner?(.js)'
);

const activityRunnersExt = entries(activityRunnersRaw).reduce((acc, [k, v]) => {
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
}, {});

const activityRunnersRawInternal = importAll.deferred(
  '../internalActivities/*/client/ActivityRunner?(.js)'
);

export const activityRunners: Object = entries(
  activityRunnersRawInternal
).reduce((acc, [k, v]) => {
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
}, activityRunnersExt);
