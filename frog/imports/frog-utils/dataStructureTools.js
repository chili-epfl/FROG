// @flow

import type {
  dataUnitT,
  structureDefT,
  dataUnitStructT,
  socialStructureT,
  activityDataT
} from './types';
import { focusStudent } from './socstructTools';

const logFirst = (...msg) => {
  console.error(msg);
  return msg;
};

const mergeConfig = (
  configData: Object,
  payload: ?dataUnitStructT
): dataUnitStructT => ({
  data: payload ? payload.data : null,
  config: {
    ...configData,
    ...(payload ? payload.config : {})
  }
});

// takes a single dataUnit, config object, or both, for all students, and wraps them in a proper
// activityDataT structure
export const wrapUnitAll = (
  data: dataUnitT = null,
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
): dataUnitStructT => {
  if (!data) {
    return { data: null, config: {} };
  } else if (data.structure === 'all') {
    return data.payload?.all;
  } else if (data.structure === 'individual') {
    if (activityStructure === 'individual') {
      return data?.payload?.[attributeValue];
    }
    throw logFirst(
      'Cannot provide individually mapped product to an activity above plane 1'
    );
  } else {
    if (typeof activityStructure === 'object') {
      if (data.structure.groupingKey !== activityStructure.groupingKey) {
        throw logFirst(
          'Incompatible grouping keys',
          data.structure.groupingKey,
          activityStructure.groupingKey
        );
      }
      if (data.payload[attributeValue] !== undefined) {
        return data.payload[attributeValue];
      } else {
        throw logFirst('Grouping value not found in activityData');
      }
    }

    if (activityStructure === 'individual') {
      if (!socialStructure) {
        throw logFirst(
          'Cannot map group product to individual without a social structure'
        );
      }
      const studentAttributes = focusStudent(socialStructure)[attributeValue];
      if (!studentAttributes && !data.payload.default) {
        throw logFirst(
          'Student not in social structure and no default value provided'
        );
      }
      if (
        typeof data.structure === 'object' &&
        (studentAttributes
          ? studentAttributes[data.structure.groupingKey]
          : data.payload.default) !== undefined
      ) {
        const grp = studentAttributes
          ? studentAttributes[data.structure.groupingKey]
          : 'default';
        if (data.payload[grp] !== undefined) {
          return data.payload[grp];
        }
        throw logFirst('Grouping value not found in activityData');
      }
      throw logFirst('Student not in group matching groupingKey');
    }
    throw logFirst(
      'Cannot provide group mapped product to a full-class activity'
    );
  }
};

export const getMergedExtractedUnit = (
  configData: Object,
  data: activityDataT,
  activityStructure: structureDefT,
  attributeValue: string,
  socialStructure?: socialStructureT
): ?dataUnitStructT =>
  mergeConfig(
    configData,
    extractUnit(data, activityStructure, attributeValue, socialStructure)
  );
