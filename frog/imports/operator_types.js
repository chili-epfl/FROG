import opLikeWithLike from 'op-like-with-like'
import opAggregateText from 'op-aggregate-text'

import { keyBy } from 'lodash'

export const operator_types = [opLikeWithLike, opAggregateText]
export const operator_types_obj = keyBy(operator_types, 'id')
