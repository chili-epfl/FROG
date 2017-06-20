// @flow

import type {
  dataUnitT,
  structureDefT,
  dataUnitStructT,
  socialStructureT,
  activityDataT
} from './types';
import { getAttributeKeys, focusStudent } from './socstructTools';

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
  activityStructure: structureDefT,
  attributeValue: string,
  socialStructure?: socialStructureT
): ?dataUnitStructT => {
  if (!data) {
    return;
  }

  if (data.structure === 'all') {
    return data.payload.all;
  }

  if (data.structure === 'individual') {
    if (activityStructure === 'individual') {
      return data.payload[attributeValue];
    } else {
      throw 'Cannot provide individually mapped product to an activity above plane 1';
    }
  }

  if (
    typeof data.structure === 'object' &&
    typeof data.structure.groupingKey === 'string'
  ) {
    if (typeof activityStructure === 'object') {
      if (getAttributeKeys(data).indexOf(data.structure.groupingKey)) {
        return data.payload[attributeValue];
      } else {
        throw 'Grouping key not found in activityData';
      }
    } else if (activityStructure === 'individual' && socialStructure) {
      const studentFocused = focusStudent(socialStructure);
      if (!studentFocused[attributeValue]) {
        Error('Student not in social structure');
      }
      if (!studentFocused[attributeValue][data.structure.groupingKey]) {
        Error('Student not in group matching groupingKey');
      }
      const grp = studentFocused[attributeValue][data.structure.groupingKey];
      return data.payload[grp];
    }
  }
};
