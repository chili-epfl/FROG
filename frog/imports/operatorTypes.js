import opLikeWithLike from 'op-like-with-like';
import opAggregateText from 'op-aggregate-text';
import opAggregateCKBoard from 'op-aggregate-ck-board';
import opJigsaw from 'op-jigsaw';

import { keyBy } from 'lodash';

export const operatorTypes = [
  opLikeWithLike,
  opAggregateText,
  opAggregateCKBoard,
  opJigsaw
];
export const operatorTypesObj = keyBy(operatorTypes, 'id');
