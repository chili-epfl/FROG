import opLikeWithLike from 'op-like-with-like'
import opAggregateText from 'op-aggregate-text'
import opAggregateCKBoard from 'op-aggregate-ck-board'

import { keyBy } from 'lodash'

export const operatorTypes = [opLikeWithLike, opAggregateText, opAggregateCKBoard]
export const operatorTypesObj = keyBy(operatorTypes, 'id')
