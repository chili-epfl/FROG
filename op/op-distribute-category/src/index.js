// @flow

import { sample } from 'lodash';
import { type productOperatorT, focusStudent } from 'frog-utils';

const meta = {
  name: 'Distribute categorized objects',
  shortName: 'Distribute categorized',
  shortDesc: 'Distribute categorized products objects to instances',
  description: 'Distribute categorized products objects to instances.'
};

const config = {
  type: 'object',
  properties: {}
};

const checkObject = obj =>
  obj &&
  typeof obj === 'object' &&
  obj.key &&
  obj.category &&
  typeof obj.category === 'string';

export const distributeObjects = (
  objects: Object[],
  targetInstances: string[],
  categories: string[]
) => {
  const payload = {};
  targetInstances.forEach(instance => {
    payload[instance] = { data: {} };
    categories.forEach(category => {
      const choices = objects.filter(
        x => x.key && x.instanceId !== instance && x.category === category
      );
      const obj = sample(choices);
      if (obj) {
        payload[instance].data[obj.key] = obj;
      }
    });
  });
  return payload;
};

const operator = (configData, object) => {
  // If several groupingKey exist in the social structure, we select the first
  // One alternative could be to have it in the configuration
  const groupingKey = Object.keys(object.socialStructure)[0];
  const instancesObj = Object.values(object.socialStructure)[0];

  const targetInstances =
    typeof instancesObj === 'object' && instancesObj
      ? Object.keys(instancesObj)
      : [];

  const socStruct = focusStudent(object.socialStructure);
  const objects = Object.keys(object.activityData.payload.all.data)
    .map(k => object.activityData.payload.all.data[k])
    .filter(checkObject)
    .map(obj => ({
      ...obj,
      instanceId: socStruct[obj.instanceId][groupingKey] || obj.instanceId
    }));

  const categories = objects.reduce(
    (acc, obj) => (!acc.includes(obj.category) ? [...acc, obj.category] : acc),
    []
  );

  const payload = distributeObjects(objects, targetInstances, categories);
  return { structure: { groupingKey }, payload };
};

export default ({
  id: 'op-distribute-category',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
