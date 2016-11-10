import opRandom from 'op-random'
import opArguegraph from 'op-arguegraph'
import opAggregateText from 'op-aggregate-text'

import { keyBy } from 'lodash'

export const operator_types = [opRandom, opArguegraph, opAggregateText]
export const operator_types_obj = keyBy(operator_types, 'id')
