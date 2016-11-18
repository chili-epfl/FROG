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

// takes a list like [['a','b'],['c','d']] and turns it into an object {'a': 0, 'b': 0, 'c': 1, 'd': 1} 
// currently used to process social structure
const arrayConstKey = (arr, value) => arr.reduce(
  (acc, x) => ({...acc, [x]: value}), {})

export const objectIndex = (a) => {
  const [_, dict] = a.reduce( 
    ([cnt, dict], x) => ([cnt + 1, {...dict, ...arrayConstKey(x, cnt)}])
    , [0, {}])
  
  return dict
}
