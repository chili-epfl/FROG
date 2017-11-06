// @flow

import { fill, isEmpty } from 'lodash';

// given a tab separated text table, finds any columns that are empty (no values present)
// and removes these columns, returning a string with the new table
const cleanEmptyCols = (data: string): string => {
  const lines = data.split('\n').map(l => l.split('\t'));
  const fields = lines.slice(1).reduce((acc: boolean[], i) => {
    i.forEach((x, n) => {
      if (!isEmpty(x) && x !== '""') {
        acc[n] = true;
      }
    });
    return acc;
  }, fill(Array(lines[0].length), false));
  return lines.map(x => x.filter((_, i) => fields[i]).join('\t')).join('\n');
};

export default cleanEmptyCols;
