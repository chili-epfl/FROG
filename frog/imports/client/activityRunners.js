// @flow

import importAll from 'import-all.macro';
import { Loadable, entries } from 'frog-utils';

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
  '../internalActivities/*/ActivityRunner?(.js)'
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
