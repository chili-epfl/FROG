// @flow
import { wrapUnitAll, type productOperatorRunnerT, values } from 'frog-utils';
import { orderBy, groupBy, sumBy } from 'lodash';
import stringify from 'json-stable-stringify';

const li2string = li =>
  typeof li === 'string' ? li : stringify(li?.liDocument?.payload);

const operator = (config = {}, object) => {
  const result = Object.keys(object.activityData.payload).reduce((acc, x) => {
    const items = Object.values(object.activityData.payload[x].data);
    if (config.topN) {
      return [...acc, ...orderBy(items, 'score', 'desc').slice(0, config.topN)];
    } else {
      return acc.concat(items);
    }
  }, []);

  let finalResult = result;
  if (config.unique) {
    const groups = groupBy(result, x => li2string(x.li));
    if (config.countScore) {
      finalResult = values(groups).reduce((acc, x) => {
        acc[x[0].id] = { ...x[0], score: x.length };
        return acc;
      }, {});
    } else if (config.sumScore) {
      finalResult = values(groups).reduce((acc, x) => {
        acc[x[0].id] = { ...x[0], score: sumBy(x, y => y.score) || 0 };
        return acc;
      }, {});
    } else {
      finalResult = values(groups).reduce((acc, x) => {
        acc[x[0].id] = x[0];
        return acc;
      }, {});
    }
  }
  return wrapUnitAll(finalResult);
};

export default (operator: productOperatorRunnerT);
