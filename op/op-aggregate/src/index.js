// @flow

import { sortBy, flatten } from 'lodash';
import { type productOperatorT, wrapUnitAll } from 'frog-utils';
import op2 from './addcat';

const meta = {
  name: 'Aggregate items',
  shortDesc: 'Aggregate items from groups',
  description: 'Optionally selecting the top n items by score'
};

const config = {
  type: 'object',
  properties: {
    chooseTop: { type: 'boolean', title: 'Select top n items by score?' },
    topN: { type: 'number', title: 'n' },
    addCat: { type: 'boolean', title: 'Add instance names as categories' }
  }
};

const configUI = { topN: { conditional: 'chooseTop' } };

const operator = (configData, object, prodall) => {
  const finalresult = flatten(
    prodall.map(item => {
      const result = Object.keys(item.activityData.payload).reduce((acc, x) => {
        let items = item.activityData.payload[x];
        if (!Array.isArray(items)) {
          items = Object.values(items);
        }
        items = flatten(items);
        console.log('items', items);
        if (configData.addCat) {
          items = items.map(it => ({
            ...it,
            category: { ...it.category, group: x }
          }));
        }
        if (false) {
          //configData.topN) {
          return [...acc, ...sortBy(items, 'score').slice(0, configData.topN)];
        } else {
          return [...acc, ...items];
        }
      }, []);
      return result;
    })
  );
  console.log(finalresult);
  console.log(wrapUnitAll(finalresult));
  return wrapUnitAll(finalresult);
};

export default [
  ({
    id: 'op-aggregate',
    type: 'product',
    operator,
    config,
    configUI,
    meta
  }: productOperatorT),
  op2
];
