// @flow

import { shuffle, chunk, compact } from 'lodash';
import type { ObjectT, SocialStructureT } from 'frog-utils';
import { focusRole } from 'frog-utils';

export const meta = {
  name: 'Create groups',
  type: 'social'
};

export const config = {
  type: 'object',
  properties: {
    groupsize: {
      type: 'number',
      title: 'Desired group size'
    },
    strategy: {
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of students in each group (minimum) or no more than this number of students per group (maximum)?',
      enum: ['minimum', 'maximum']
    },
    grouping: {
      type: 'string',
      title: "Name of social attribute (default 'group')"
    }
  }
};

export const operator = (configData, object) => {
  const { globalStructure } = object;

  const ids = shuffle(globalStructure.studentIds);
  const struct = chunk(ids, configData.groupsize);
  const last = struct.slice(-1);
  if (last.length < configData.groupsize && configData.strategy === 'minimum') {
    const leftover = struct.pop();
    while (leftover.length > 0) {
      struct.forEach(x => x.push(leftover.pop()));
    }
  }
  const newGrouping = configData.grouping && configData.grouping.length > 0
    ? configData.grouping
    : 'group';

  const result = {
    [newGrouping]: struct.reduce(
      (acc, k, i) => ({ ...acc, [i + 1]: compact(k) }),
      {}
    )
  };
  return result;
};

export default {
  id: 'op-create-groups',
  operator,
  config,
  meta
};
