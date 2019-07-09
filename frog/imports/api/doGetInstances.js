// @flow

import { Meteor } from 'meteor/meteor';
import {
  getAttributeValues,
  type ObjectT,
  type GlobalStructureT,
  type structureDefT,
  type ActivityDbT
} from 'frog-utils';
import { Connections, Operators } from './activities';
import { Products } from './products';

// given an activityEntry and an objectEntry, calculates which instances
// to create
export default (
  activity: ActivityDbT,
  object: ObjectT & GlobalStructureT
): { groups: string[], structure: structureDefT } => {
  let groups;
  let structure;

  if (activity.plane === 1) {
    groups =
      object && object.globalStructure ? object.globalStructure.studentIds : [];
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

const f = activity => {
  const connections = Connections.find({ 'target.id': activity._id }).fetch();
  const connIds = connections.map(x => x._id);
  const controlOp = Operators.find({
    _id: { $in: connIds },
    type: 'control'
  }).fetch();
  if (!controlOp) {
    return true;
  }

  const structraw = Products.findOne(controlOp._id);
  const struct = structraw && structraw.controlStructure;
  if (!struct) {
    return true;
  }

  if (struct.list && !struct.list[activityId]) {
    return true;
  }

  const cond = struct.all ? struct.all : struct.list[activityId];
  if (cond.structure === 'individual') {
    const payload = cond.payload[userid];
    if (!payload && cond.mode === 'include') {
      return false;
    }

    if (payload && cond.mode === 'exclude') {
      return false;
    }
    return true;
  }
};
