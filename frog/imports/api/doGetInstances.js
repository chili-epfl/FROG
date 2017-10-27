// @flow

import { Meteor } from 'meteor/meteor';
import {
  getAttributeValues,
  type ObjectT,
  type GlobalStructureT,
  type structureDefT,
  type ActivityDbT
} from 'frog-utils';

// given an activityEntry and an objectEntry, calculates which instances
// to create
export default (
  activity: ActivityDbT,
  object: ObjectT & GlobalStructureT
): { groups: string[], structure: structureDefT } => {
  let groups;
  let structure;

  if (activity.plane === 1) {
    groups = object.globalStructure.studentIds;
    structure = 'individual';
  } else if (activity.plane === 2) {
    const key = activity.groupingKey;
    if (typeof key !== 'string') {
      throw new Meteor.Error('Need groupingKey in p2 activities, got:', key);
    } else {
      groups = getAttributeValues(object.socialStructure, key);
      structure = { groupingKey: key };
    }
  } else {
    groups = ['all'];
    structure = 'all';
  }

  return { groups, structure };
};
