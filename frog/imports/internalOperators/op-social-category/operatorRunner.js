// @flow

import {
  type productOperatorRunnerT,
  cloneDeep,
  focusStudent
} from '/imports/frog-utils';

import { isObject } from 'lodash';

const operator = (configData, object) => {
  const roles = focusStudent(object.socialStructure);
  const structure = object.activityData.structure;
  const payload = cloneDeep(object.activityData.payload);
  Object.keys(payload).forEach(instance => {
    Object.keys(payload[instance].data).forEach(item => {
      const category = isObject(structure)
        ? instance
        : roles[instance]?.[configData.socialAttribute];
      payload[instance].data[item].category = category;
    });
  });
  return { structure, payload };
};

export default (operator: productOperatorRunnerT);
