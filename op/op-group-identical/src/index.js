// @flow

import Stringify from 'json-stable-stringify';

import type { socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Group based on identical student data',
  type: 'social'
};

const config = {
  type: 'object',
  properties: {}
};

// Obviously assumes even array
const operator = (configData, object) => {
  const { activityData } = object;
  if (activityData.structure !== 'individual') {
    throw 'This operator can only work on an activityStructure with individual student data';
  }

  const objects = {};
  const data = activityData.payload;
  Object.keys(data).forEach(studentId => {
    const newO = Stringify(data[studentId]);
    objects[newO] = objects[newO] ? [...objects[newO], studentId] : [studentId];
  });
  const res = Object.keys(objects).reduce(
    (acc, k, i) => ({ ...acc, [i]: objects[k] }),
    {}
  );

  return {
    group: res
  };
};

export default ({
  id: 'op-group-identical',
  operator,
  config,
  meta
}: socialOperatorT);
