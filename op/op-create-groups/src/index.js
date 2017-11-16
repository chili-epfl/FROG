// @flow

import { shuffle, chunk, compact, range } from 'lodash';
import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Create groups',
  shortDesc: 'Group students randomly',
  description:
    'Create random groups of students, configurable group size and strategy (at least n students, or maximum n students per group).'
};

const config = {
  type: 'object',
  required: ['grouping', 'groupsize', 'strategy', 'globalnum'],
  properties: {
    groupnumber: {
      type: 'boolean',
      title: 'Specify desired number of groups, instead of number of members'
    },
    groupsize: {
      type: 'number',
      title: 'Desired group size',
      default: 3
    },
    strategy: {
      default: 'minimum',
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of students in each group (minimum) or no more than this number of students per group (maximum)?',
      enum: ['minimum', 'maximum']
    },
    globalnum: {
      type: 'number',
      title:
        'Desired number of groups in the class (if you enter 3, and there are only 2 students, there will be only 2 groups)'
    },
    grouping: {
      type: 'string',
      title: 'Name of social attribute',
      default: 'group'
    }
  }
};

const configUI = {
  groupsize: { conditional: formdata => !formdata.groupnumber },
  strategy: { conditional: formdata => !formdata.groupnumber },
  globalnum: { conditional: 'groupnumber' }
};

const outputDefinition = conf => [(conf && conf.grouping) || 'group'];

const splitArray = (ary, splits) => {
  const grpsize = Math.round(ary.length / splits);
  const grps = range(1, splits).map(() => ary.splice(-grpsize));
  if (ary.length > 0) {
    grps.push(ary);
  }
  return grps;
};

const operator = (configData, object) => {
  const { globalStructure } = object;

  const ids = shuffle(globalStructure.studentIds);
  let struct: string[][];
  if (configData.groupnumber) {
    let globalnum = configData.globalnum;
    if (ids && configData.globalnum >= ids.length) {
      globalnum = ids.length;
    }
    struct = splitArray(ids, globalnum);
  } else {
    if (ids && configData.groupsize >= ids.length) {
      return { group: { '1': ids } };
    }

    struct = chunk(ids, configData.groupsize);
    const last = struct.slice(-1)[0];
    if (
      last.length < configData.groupsize &&
      configData.strategy === 'minimum'
    ) {
      const leftover = struct.pop();
      while (leftover.length > 0) {
        struct.forEach(x => x.push(leftover.pop()));
      }
    }
  }
  const newGrouping =
    configData.grouping && configData.grouping.length > 0
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

export default ({
  id: 'op-create-groups',
  type: 'social',
  operator,
  config,
  configUI,
  meta,
  outputDefinition
}: socialOperatorT);
