// @flow

import importAll from 'import-all.macro';
import { type ActivityPackageT, entries, values } from 'frog-utils';

const packagesRaw = importAll.sync('../node_modules/ac-*/src/index.js');
export const activityTypesExt = entries(packagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

const internal = importAll.sync('./internalActivities/*/index.js');

export const activityTypesObj: { [at: string]: ActivityPackageT } = entries(
  internal
).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  activityTypesExt
);

export const activityTypes: ActivityPackageT[] = values(activityTypesObj);

const activityRunnersRaw = importAll.sync(
  '../node_modules/ac-*/src/ActivityRunner?(.js)'
);
export const activityRunnersExt = entries(activityRunnersRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

const activityRunnersRawInternal = importAll.sync(
  './internalActivities/*/ActivityRunner?(.js)'
);

export const activityRunners = entries(activityRunnersRawInternal).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  activityRunnersExt
);
