// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Distance from (x,y) coordinates',
  shortDesc: 'Distance from (x,y) coordinates.',
  description: 'Distance from (x,y) coordinates.'
};

const config = {
  type: 'object',
  properties: {}
};

const operator = (_, object) => {
  const { payload } = object.activityData;
  const isValid = i => {
    const c = payload[i].data.coordinates;
    return c && c.valid;
  };
  const instances = Object.keys(payload).filter(isValid);

  const distance = (coordA, coordB) =>
    Math.sqrt((coordA.x - coordB.x) ** 2 + (coordA.y - coordB.y) ** 2);

  const distanceMatrix = instances.map(A =>
    instances.map(B =>
      distance(payload[A].data.coordinates, payload[B].data.coordinates)
    )
  );

  return {
    structure: 'all',
    payload: { all: { data: { instances, distanceMatrix } } }
  };
};

export default ({
  id: 'op-xy-distance',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
