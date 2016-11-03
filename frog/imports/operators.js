import opRandom from 'op-random'
import opArguegraph from 'op-arguegraph'

import { keyBy } from 'lodash'

export const operators = [opRandom, opArguegraph]
export const operators_hash = keyBy(operators, 'id')
