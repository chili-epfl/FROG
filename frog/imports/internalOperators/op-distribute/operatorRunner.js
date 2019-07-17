// @flow
import { shuffle, compact } from 'lodash';
import { type productOperatorRunnerT, uuid } from '/imports/frog-utils';

const operator = async (configData, object, dataFn) => {
  const { globalStructure, socialStructure, activityData } = object;
  if (activityData.structure !== 'all') {
    throw 'Cannot redistribute already distributed content';
  }
  let products = activityData.payload.all.data;
  if (!Array.isArray(products)) {
    products = Object.values(products);
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
    (acc, x) => ({
      ...acc,
      [x]: {
        data: res[x].reduce((acc2, item) => {
          acc2[item.id] = item;
          return acc2;
        }, {})
      }
    }),
    {}
  );

  if (configData.duplicateLIs) {
    await Promise.all(
      Object.keys(res).map(async instance => {
        await Promise.all(
          Object.keys(res[instance].data).map(async itemKey => {
            const item = res[instance].data[itemKey];
            const newLI = await dataFn.duplicateLI(item.li);
            const newID = uuid();
            res[instance].data[newID] = {
              ...res[instance].data[itemKey],
              id: newID,
              li: newLI
            };
            delete res[instance].data[itemKey];
          })
        );
      })
    );
  }

  const structure = configData.individual
    ? 'individual'
    : { groupingKey: configData.grouping };
  return { structure, payload: res };
};

export default (operator: productOperatorRunnerT);
