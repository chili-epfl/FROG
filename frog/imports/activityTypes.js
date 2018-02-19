// @flow

import { keyBy } from 'lodash';
import { type ActivityPackageT, flattenOne } from 'frog-utils';

import acStroop from 'ac-stroop';
import acDash from './internalActivities/ac-dash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acStroop,
  acDash
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
