// @flow
import { shuffle, chunk, compact, range } from 'lodash';
import { type socialOperatorRunnerT } from 'frog-utils';

const splitArray = (ary, splits, overflow) => {
  const grpsize = Math.round(ary.length / splits);
  const grps = range(1, splits).map(() => ary.splice(-grpsize));
  if (ary.length > 0) {
    if (grps.length >= ary.length && !overflow && grps.length + 1 < splits) {
      ary.forEach((x, i) => {
        grps[i].push(x);
      });
    } else {
      grps.push(ary);
    }
  }
  return grps;
};

const operator = (configData, object) => {
  const { globalStructure } = object;

  const ids = shuffle(globalStructure.studentIds);
  let struct: string[][];
  if (configData.groupnumber) {
    let globalnum = configData.globalnum;
    let overflow = false;
    if (ids && configData.globalnum >= ids.length) {
      globalnum = ids.length;
      overflow = true;
    }
    struct = splitArray(ids, globalnum, overflow);
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
      (acc, k, i) => ({ ...acc, [i + 1 + '']: compact(k) }),
      {}
    )
  };
  return result;
};

export default (operator: socialOperatorRunnerT);
