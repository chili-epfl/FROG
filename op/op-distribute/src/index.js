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
  const { globalStructure, socialStructure, product } = object;
  const groups =
    socialStructure[configData.grouping] &&
    Object.keys(socialStructure[configData.grouping]);
  if (!groups) {
    console.error(
      `Could not find ${configData.grouping} in the social structure`
    );
    return;
  }
  let res = groups.reduce((acc, k) => ({ ...acc, [k]: [] }), {});

  if (configData.overlap) {
    res = Object.keys(res).reduce(
      (acc, k) => ({ ...acc, [k]: shuffle(product) }),
      {}
    );
  } else {
    const shufprod = shuffle(product);
    while (shufprod.length > 0) {
      res = Object.keys(res).reduce(
        (acc, k) => ({ ...acc, [k]: [...acc[k], shufprod.pop()] }),
        res
      );
    }
  }
  return Object.keys(res).reduce(
    (acc, x) => ({
      ...acc,
      [x]: compact(res[x].slice(0, configData.maxitems))
    }),
    {}
  );
};

export default {
  id: 'op-distribute',
  operator,
  config,
  meta
};
