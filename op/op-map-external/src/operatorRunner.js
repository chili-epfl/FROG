// @flow

import util from 'util';
import { type productOperatorRunnerT, wrapUnitAll, values } from 'frog-utils';
import { isObject, invert } from 'lodash';

const operator = (configData, object) => {
  const data = object.activityData.payload.all.data;
  const res = {};
  if (!isObject(data)) {
    return wrapUnitAll({});
  }
  values(data).forEach(item => {
    const username = item.li?.liDocument?.username;
    const students = invert(object.globalStructure.students);
    const userid = username && students[username];
    if (userid) {
      if (!res[userid]) {
        res[userid] = { data: {}, config: {} };
      }
      res[userid].data[item.id] = item;
    }
  });
  return { structure: 'individual', payload: res };
};

export default (operator: productOperatorRunnerT);
