// @flow

import opLikeWithLike from 'op-like-with-like';
import opAggregateText from 'op-aggregate-text';
import opAggregateCKBoard from 'op-aggregate-ck-board';
import opJigsaw from 'op-jigsaw';
import opArgue from 'op-argue';
import opHypothesis from 'op-hypothesis';

import type { OperatorPackageT } from 'frog-utils';

import { keyBy } from 'lodash';

export const operatorTypes: Array<OperatorPackageT> = [
  opLikeWithLike,
  opAggregateText,
  opAggregateCKBoard,
  opJigsaw,
  opArgue,
  opHypothesis
];
export const operatorTypesObj = keyBy(operatorTypes, 'id');
