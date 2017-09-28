// @flow

import acProx from 'ac-prox';
import acImgClass from 'ac-imgClass';
import acImgView from 'ac-imgView';
import acQuiz from 'ac-quiz';

import { type ActivityPackageT, flattenOne } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acImgView,
  acProx,
  acImgClass,
  acQuiz
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
