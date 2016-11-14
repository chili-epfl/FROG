import { groupBy, map } from 'lodash'
import Stringify from 'json-stable-stringify'

export const meta = {
  name: 'Group like with like',
  type: 'social'
}

export const config = {
  title: 'Configuration for Like with Like',
  type: 'object',
  properties: {
  }
}

// Obviously assumes even array
export const operator = (_, products) => {
  const groups = groupBy(products, x => Stringify(x.data))
  console.log(groups)
  const res = map(groups, v => v.map(x => x.user_id))


  return res
}

export default { id: 'op-like-with-like', operator: operator, config: config, meta: meta }

