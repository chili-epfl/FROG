// @flow

// If you try to insert value=0 path=['a', 'b', 'c']
// into sharedb with doc={ 'a': { d:5 } }
// an error occur because doc['a']['b'] is undefined.
// This function cleans the query by changing it to
// path=['a'] value={ b: { c: 0 } }
// (see ./__tests__/index.js for more details)
export const splitPathObject = (obj: Object, path: string[], value: any) => {
  const { insertPath, leftoverPath } = path.reduce(
    (acc, val) =>
      acc.obj
        ? { ...acc, obj: acc.obj[val], insertPath: [...acc.insertPath, val] }
        : { ...acc, leftoverPath: [val, ...acc.leftoverPath] },
    { obj, insertPath: [], leftoverPath: [] }
  );

  let insertObject = value;
  leftoverPath.forEach(val => {
    insertObject = { [val]: insertObject };
  });

  return { insertPath, insertObject };
};
