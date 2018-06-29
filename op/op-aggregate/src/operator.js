import { wrapUnitAll } from 'frog-utils';
import { sortBy } from 'lodash';

const operator = (configData = {}, object) => {
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

export default operator;
