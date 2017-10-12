// @flow

import acMonty from 'ac-monty';
import acProx from 'ac-prox';
import acImgClass from 'ac-imgClass';
import acImgView from 'ac-imgView';
import acQuiz from 'ac-quiz';
import acText from 'ac-text';

import { type ActivityPackageT, flattenOne } from 'frog-utils';

import { keyBy } from 'lodash';

export const activityTypes: ActivityPackageT[] = flattenOne([
  acMonty,
  acImgView,
  acProx,
  acImgClass,
  acQuiz,
  acText
]).map(x => Object.freeze(x));

// see explanation of `any` in operatorTypes.js
export const activityTypesObj: { [actId: string]: ActivityPackageT } = (keyBy(
  activityTypes,
  'id'
): any);
