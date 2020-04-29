// @flow
import { shuffle, chunk, compact, range } from 'lodash';
import { type socialOperatorRunnerT } from '/imports/frog-utils';

const splitArray = (ary, splits) => {
  const grpsize = Math.round(ary.length / splits);
  const grps = range(1, splits).map(() => ary.splice(-grpsize));
  if (ary.length > 0) {
    grps.push(ary);
  }
  return grps;
};

const operator = (configData, object) => {
  const { socialStructure } = object;

  const newGrouping: string =
    configData.grouping && configData.grouping.length > 0
      ? configData.grouping
      : 'groupCombined';

  const oldGroup = socialStructure[configData.incomingGrouping];
  const groupIds = shuffle(Object.keys(oldGroup));

  let struct: string[][];
  if (configData.groupnumber) {
    let globalnum = configData.globalnum;
    if (groupIds && configData.globalnum >= groupIds.length) {
      globalnum = groupIds.length;
    }
    struct = splitArray(groupIds, globalnum);
  } else {
    if (groupIds && configData.groupsize >= groupIds.length) {
      return {
        [newGrouping]: {
          '1': groupIds.reduce((acc, x) => acc.concat(oldGroup[x]), [])
        }
      };
    }

    struct = chunk(groupIds, configData.groupsize);
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
      (acc, k, i) => ({
        ...acc,
        [i + 1 + '']: compact(k).reduce(
          (acc1, x) => acc1.concat(oldGroup[x]),
          []
        )
      }),
      {}
    )
  };
  return result;
};

export default (operator: socialOperatorRunnerT);
