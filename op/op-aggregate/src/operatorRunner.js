// @flow
import { type productOperatorRunnerT, uuid } from 'frog-utils';
import { orderBy } from 'lodash';

const operator = (configData = {}, object) => {
  const result = Object.keys(object.activityData.payload).reduce((acc, x) => {
    const items = Object.values(object.activityData.payload[x].data);
    if (configData.topN) {
      return acc.concat(
        orderBy(items, [z => z.score || ''], ['desc']).slice(0, configData.topN)
      );
    } else {
      return acc.concat(items);
    }
  }, []);
  const objRes = result.reduce((acc, y) => {
    const id = uuid();
    acc[id] = { id, ...y };
    return acc;
  }, {});
  return {
    structure: 'all',
    payload: { all: { data: objRes, config: {} } }
  };
};

export default (operator: productOperatorRunnerT);
