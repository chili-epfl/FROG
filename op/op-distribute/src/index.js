// @flow

import { shuffle, compact } from 'lodash';
import { type productOperatorT, values, idObj } from 'frog-utils';

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
  console.log(values(activityData));
  if (
    activityData.structure !== 'all' &&
    !values(activityData).every(x => x.structure === 'all')
  ) {
    throw 'Cannot redistribute already distributed content';
  }
  let products;
  if (activityData.structure === 'all') {
    products = values(activityData.payload.all.data);
  } else {
    const val = values(activityData).map(x => x.payload.all.data);
    const reduced = val.reduce((acc, x) => ({ ...acc, ...x }), {});
    products = values(reduced);
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
  console.log(res);

  res = Object.keys(res).reduce(
    (acc, x) => ({
      ...acc,
      [x]: compact(res[x].slice(0, configData.maxitems))
    }),
    {}
  );
  console.log(res);
  res = Object.keys(res).reduce(
    (acc, x) => ({ ...acc, [x]: { data: idObj(res[x]) } }),
    {}
  );
  console.log(res);

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
