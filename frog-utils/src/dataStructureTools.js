// @flow

import type {
  dataUnitT,
  structureDefT,
  dataUnitStructT,
  socialStructureT,
  activityDataT
} from './types';
import { focusStudent } from './socstructTools';

const logAndThrow = msg => {
  console.log(msg); // eslint-disable-line
  throw msg;
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
    return data.payload.all;
  } else if (data.structure === 'individual') {
    if (activityStructure === 'individual') {
      return data.payload[attributeValue];
    }
    logAndThrow(
      'Cannot provide individually mapped product to an activity above plane 1'
    );
  } else {
    if (typeof activityStructure === 'object') {
      if (data.structure.groupingKey !== activityStructure.groupingKey) {
        logAndThrow('Incompatible grouping keys');
      }
      if (data.payload[attributeValue] !== undefined) {
        return data.payload[attributeValue];
      } else {
        logAndThrow('Grouping value not found in activityData');
      }
    }

    if (activityStructure === 'individual') {
      if (!socialStructure) {
        logAndThrow(
          'Cannot map group product to individual without a social structure'
        );
      }
      const studentAttributes = focusStudent(socialStructure)[attributeValue];
      if (!studentAttributes) {
        logAndThrow('Student not in social structure');
      }
      if (
        typeof data.structure === 'object' &&
        studentAttributes[data.structure.groupingKey] !== undefined
      ) {
        const grp = studentAttributes[data.structure.groupingKey];
        if (data.payload[grp] !== undefined) {
          return data.payload[grp];
        }
        logAndThrow('Grouping value not found in activityData');
      }
      logAndThrow('Student not in group matching groupingKey');
    }
    logAndThrow('Cannot provide group mapped product to a full-class activity');
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
