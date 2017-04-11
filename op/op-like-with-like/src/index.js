// @flow

import Stringify from 'json-stable-stringify';

import type { ObjectT, SocialStructureT } from 'frog-utils';

export const meta = {
  name: 'Group like with like',
  type: 'social'
};

export const config = {
  type: 'object',
  properties: {}
};

// Obviously assumes even array
export const operator = (configData: Object, object: ObjectT) => {
  const products = object.products[0];

  const socStruc: SocialStructureT = {};
  let g = 0;
  const groups = {};
  products.forEach(p => {
    const key = Stringify(p.data);
    if (!groups[key]) {
      groups[key] = Stringify(g);
      g += 1;
    }
    socStruc[p.userId] = {
      group: groups[key]
    };
  });

  return {
    product: [],
    socialStructure: socStruc
  };
};

export default {
  id: 'op-like-with-like',
  operator,
  config,
  meta
};
