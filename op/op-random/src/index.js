import { shuffleList, splitAt, zipList } from 'frog-utils'

export const meta = {
  name: 'Random Operator',
  type: 'social',
  mode: 'one-pass'
}

export const config = {
  title: 'Configuration for Random Group Formation',
  type: 'object',
  properties: {
    'groupSize': {
      type: 'number',
      title: 'Group size'
    },
  }
}

// Obviously assumes even array
export const operator = (names) => zipList(splitAt(names.length/2, shuffleList(names)))

export default { id: 'op-random', operator: operator, config: config, meta: meta }
