// @flow

// From an array of [{_id, value},...] returns the object {[_id]: value}
export const KVize = (arr: Array<{ _id: string, value: any }>) => {
  const values = {};
  arr.forEach(o => (values[o._id] = o.value));
  return values;
};

// returns and array of [{_id, value},...] from any object
export const arrayize = (obj: Object) =>
  Object.entries(obj).map(x => ({ _id: x[0], value: x[1] }));

// Same as KVize ???
export const objectize = (arr: Array<{ _id: string, value: any }>) =>
  arr.reduce((acc, x) => ({ ...acc, [x._id]: x.value }), {});

// Returns first element of array of objects for which equals val on key
export const getBy = (obj: Array<Object>, key: string, val: any) =>
  obj.find(x => x[key] === val);

// takes a list like [['a','b'],['c','d']] and turns it into an object {'a': 0, 'b': 0, 'c': 1, 'd': 1}
// currently used to process social structure
const arrayConstKey = (arr, value) =>
  arr.reduce((acc, x) => ({ ...acc, [x]: value }), {});

//
export const objectIndex = (a: Array<any>) => {
  const [_, d] = a.reduce(
    ([cnt, dict], x) => [cnt + 1, { ...dict, ...arrayConstKey(x, cnt) }],
    [0, {}]
  );

  return d;
};
