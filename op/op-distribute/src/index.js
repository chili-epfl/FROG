// @flow

import { shuffle, compact } from 'lodash';
import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Distribute content',
  shortDesc: 'Distribute list items',
  description:
    'Distribute list items to groups or individual students, with configurable numbers of items per group, overlap allowed or not, etc.'
};

const config = {
  type: 'object',
  properties: {
    individual: {
      type: 'boolean',
      title: 'Distribute to each student'
    },
    grouping: {
      type: 'socialAttribute',
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

const validateConfig = [
  formData =>
    !formData.individual && !formData.grouping
      ? {
          err:
            'If you want to distribute to groups, you need groupingKey, otherwise select distributing to individuals'
        }
      : null
];

const configUI = {
  grouping: { conditional: formData => !formData.individual }
};

const operator = (configData, object) => {
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
    throw `Could not find ${configData.grouping} in the social structure`;
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
  return { structure, payload: res };
};

export default ({
  id: 'op-distribute',
  type: 'product',
  operator,
  config,
  meta,
  configUI,
  validateConfig
}: productOperatorT);
