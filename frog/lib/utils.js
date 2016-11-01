export const objectize = (arr) => {
  var values = {}
  arr.forEach(o => values[o._id] = o.value)
  return values
}

export const arrayize = (obj) => 
  Object.entries(obj).map(x => ({_id: x[0], value: x[1]})) 


