// @flow

import { type productOperatorRunnerT } from 'frog-utils';
import { isObject } from 'lodash';

const operator = (config, { activityData: data, socialStructure }) => {
  const groupMapping = {};
  const incoming = socialStructure[config.incomingGrouping];
  const outgoing = socialStructure[config.outgoingGrouping];

  if (
    isObject(data.structure) &&
    data.structure.groupingKey !== config.incomingGrouping
  ) {
    const err =
      'Requires data from an activity grouped by grouping key ' +
      config.incomingGrouping;
    console.error(err);
    throw err;
  }
  const payload = {};
  Object.keys(data.payload).forEach(incomingAttrib => {
    if (!groupMapping[incomingAttrib]) {
      const randomStudent = incoming[incomingAttrib][0];
      const targetGroup = Object.keys(outgoing).find(x =>
        outgoing[x].includes(randomStudent)
      );
      if (!targetGroup) {
        const err = `Each incoming group must be fully included in an outgoing group, but student ${randomStudent} exists in incoming group, and not in outgoing group.`;
        console.error(err);
        throw err;
      }
      groupMapping[incomingAttrib] = targetGroup;
    }
    if (!payload[groupMapping[incomingAttrib]]) {
      payload[groupMapping[incomingAttrib]] = { config: {}, data: {} };
    }
    Object.assign(
      payload[groupMapping[incomingAttrib]].data,
      data.payload[incomingAttrib]?.data
    );
  });
  return { structure: { groupingKey: config.outgoingGrouping }, payload };
};

export default (operator: productOperatorRunnerT);
