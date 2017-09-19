// @flow

import { shuffle, chunk, sortBy } from 'lodash';
import { type productOperatorT, wrapUnitAll } from 'frog-utils';

const meta = {
  name: 'Aggregate items',
  shortDesc: 'Aggregate items from groups',
  description: 'Optionally selecting the top n items by score'
};

const config = {
  type: 'object',
  properties: {
    chooseTop: { type: 'boolean', title: 'Select top n items by score?' },
    topN: { type: 'number', title: 'n', default: 2 }
  }
};

const configUI = { topN: { conditional: 'chooseTop' } };

const operator = (configData, object) => {
  const result = Object.keys(object.activityData.payload).reduce((acc, x) => {
    const items = Object.values(object.activityData.payload[x].data);
    if (configData.topN) {
      return [...acc, ...sortBy(items, 'score').slice(0, configData.topN)];
    } else {
      return [...acc, ...items];
    }
  }, []);
  return wrapUnitAll(result);
};

export default ({
  id: 'op-aggregate',
  type: 'product',
  operator,
  config,
  configUI,
  meta
}: productOperatorT);
