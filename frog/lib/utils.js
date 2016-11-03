import { omit } from 'lodash'

export const KVize = (arr, key) => {
  var values = {}
  arr.forEach(o => values[o._id] = o.value)
  return values
}

export const arrayize = (obj) => 
  Object.entries(obj).map(x => ({_id: x[0], value: x[1]})) 

export const objectize = (arr) => 
  arr.reduce( (acc, x) => ({ ...acc, [x._id]: x.value }), {})

export const getBy = (obj, key, val) => 
  obj.filter(x => x[key] == val)[0]

