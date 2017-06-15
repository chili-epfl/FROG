// @flow

import type {
  dataUnitT,
  structureDefT,
  dataUnitStructT,
  activityDataT
} from './types';
import { getAttributeKeys } from './socStructTools';

// takes a single dataUnit, config object, or both, for all students, and wraps them in a proper
// activityDataT structure
export const wrapUnitAll = (
  data: dataUnitT = {},
  config: Object = {}
): activityDataT => ({
  structure: 'all',
  payload: { all: { data, config } }
});

export const extractUnit = (
  data: activityDataT,
  structure: structureDefT,
  attributeValue: string
): ?dataUnitStructT => {
  if (!data) {
    return;
  }

  if (data.structure === 'all') {
    return data.payload.all;
  }

  if (data.structure === 'individual') {
    if (structure === 'individual') {
      return data.payload[attributeValue];
    } else {
      throw 'Cannot provide individually mapped product to an activity above plane 1';
    }
  }

  if (typeof data.structure === 'object') {
    if (getAttributeKeys(data).indexOf(data.structure.groupingKey)) {
      return data.payload[structure.groupingKey][attributeValue];
    } else {
      throw 'Grouping key not found in activityData';
    }
  }
};
