import opRandom from 'op-random'
import opArguegraph from 'op-arguegraph'

import { keyBy } from 'lodash'

export const operator_types = [opRandom, opArguegraph]
export const operator_types_obj = keyBy(operator_types, 'id')
