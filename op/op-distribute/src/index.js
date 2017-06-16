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
    individual: {
      type: 'boolean',
      title: 'Distribute to each student (or fill out grouping attribute below)'
    },
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
  const { globalStructure, socialStructure, activityData } = object;
  if (activityData.structure !== 'all') {
    throw 'Cannot redistribute already distributed content';
  }
  const products = activityData.payload.all.data;
  if (!Array.isArray(products)) {
    throw 'Can only reshuffle an array';
  }
  const groups = configData.individual
    ? globalStructure.studentIds
    : socialStructure[configData.grouping] &&
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
  res = Object.keys(res).reduce(
    (acc, x) => ({ ...acc, [x]: { data: res[x] } }),
    {}
  );

  const structure = configData.individual
    ? 'individual'
    : { groupingKey: configData.grouping };
  return { structure: structure, payload: res };
};

export default {
  id: 'op-distribute',
  operator,
  config,
  meta
};
