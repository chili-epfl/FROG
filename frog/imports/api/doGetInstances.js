// @flow
import { getAttributeValues, type ObjectT } from 'frog-utils';
import assert from 'assert';

// given an activityEntry and an objectEntry, calculates which instances
// to create
export default (activity: { groupingKey?: string }, object: ObjectT) => {
  const { socialStructure, globalStructure: { studentIds } } = object;

  let groups;
  let structure;
  if (activity.plane === 1) {
    groups = studentIds;
    structure = 'individual';
  } else if (activity.plane === 2) {
    const key = activity.groupingKey;
    if (typeof key !== 'string') {
      Error('Need groupingKey in p2 activities');
    } else {
      groups = getAttributeValues(socialStructure, key);
      structure = { groupingKey: key };
    }
  } else {
    groups = ['all'];
    structure = 'all';
  }
  return [groups, structure];
};
