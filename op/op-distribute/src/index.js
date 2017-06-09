// @flow

import { shuffle, compact } from 'lodash';
import type { ObjectT, SocialStructureT } from 'frog-utils';
import { focusRole } from 'frog-utils';

export const meta = {
  name: 'Distribute content',
  type: 'product',
  desc: ''
};

export const config = {
  type: 'object',
  properties: {
    grouping: {
      type: 'string',
      title: 'Grouping attribute'
    },
    maxitems: {
      type: 'number',
      title: 'Max number of items per group'
    },
    overlap: {
      type: 'boolean',
      title: 'Allow multiple groups receiving the same item?'
    }
  }
};

export const operator = (configData, object) => {
  const { globalStructure, socialStructure, products } = object;
  const groups =
    socialStructure[configData.grouping] &&
    Object.keys(socialStructure[configData.grouping]);
  if (!groups) {
    `Could not find ${configData.grouping} in the social structure`;
    return;
  }
  let res = groups.reduce((acc, k) => ({ ...acc, [k]: [] }), {});

  if (configData.overlap) {
    res = Object.keys(res).reduce(
      (acc, k) => ({ ...acc, [k]: shuffle(products) }),
      {}
    );
  } else {
    const shufprod = shuffle(products);
    while (shufprod.length > 0) {
      res = Object.keys(res).reduce(
        (acc, k) => ({ ...acc, [k]: [...acc[k], shufprod.pop()] }),
        res
      );
    }
  }

  res = Object.keys(res).reduce(
    (acc, x) => ({
      ...acc,
      [x]: compact(res[x].slice(0, configData.maxitems))
    }),
    {}
  );
  return res;
};

export default {
  id: 'op-distribute',
  operator,
  config,
  meta
};
