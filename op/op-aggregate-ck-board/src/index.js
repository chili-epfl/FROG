import JSONPath from 'jsonpath-plus'
import { booleanize } from 'frog-utils'

export const meta = {
  name: 'Aggregate CK Board',
  type: 'product'
}

export const config = {
  title: 'Configuration for Aggregate CK Board',
  type: 'object',
  properties: {
    'anonymize': {
      type: 'boolean',
      title: 'Anonymize contributions?'
    },
    'title_path': {
      type: 'string',
      title: 'JSONPath to title'
    },
    'content_path': {
      type: 'string',
      title: 'JSONPath to contents'
    }
  }
}
const rnd = () => Math.floor(Math.random()*300)

// Obviously assumes even array
export const operator = (config, products) => {
  const ret = products.reduce( (acc, y) => {
    return(
    ([
      ...acc, 
      ...y.data.map(x => {
        const title = JSONPath({path: config.title_path, json: x})[0]
        const content = JSONPath({path: config.content_path, json: x})[0]
        const full_content = booleanize(config.anonymize) ? 
          content :
          content + ' (' + y.username + ')'
        return({user_id: y.user_id, title: title, content: full_content, x: rnd(), y: rnd()})})
    ]))}, [])
  console.log(ret)
  return ret
}

export default { id: 'op-aggregate-ck-board', operator: operator, config: config, meta: meta }
