// @flow
import { shuffle, chunk, compact } from 'lodash';
import { type socialOperatorRunnerT } from '/imports/frog-utils';

const operator = (configData, object) => {
  const { globalStructure } = object;
  const ids = shuffle(globalStructure.studentIds);

  const newGrouping: string =
    configData.grouping && configData.grouping.length > 0
      ? configData.grouping
      : 'group';

  if (ids.length === 0) {
    return { [newGrouping]: {} };
  }
  let struct: string[][];
  if (configData.groupnumber) {
    struct = new Array(configData.globalnum).fill(null).map(() => []);
    ids.forEach((instanceId, idx) => {
      struct[idx % configData.globalnum].push(instanceId);
    });
  } else {
    if (ids && configData.groupsize >= ids.length) {
      return { [newGrouping]: { '1': ids } };
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

  const result = {
    [newGrouping]: struct.reduce(
      (acc, k, i) => ({ ...acc, [i + 1 + '']: compact(k) }),
      {}
    )
  };
  return result;
};

export default (operator: socialOperatorRunnerT);
