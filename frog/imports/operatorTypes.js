// @flow

import opLikeWithLike from 'op-like-with-like';
import opSelectBest from 'op-select-best';
import opJigsaw from 'op-jigsaw';
import opArgue from 'op-argue';

import type { OperatorPackageT } from 'frog-utils';

import { keyBy } from 'lodash';

export const operatorTypes: Array<OperatorPackageT> = [
  opLikeWithLike,
  opSelectBest,
  opJigsaw,
  opArgue
];
export const operatorTypesObj = keyBy(operatorTypes, 'id');
