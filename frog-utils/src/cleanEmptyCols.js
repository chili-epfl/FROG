// @flow

import { fill, isEmpty } from 'lodash';

const cleanEmptyCols = (data: string): string => {
  const lines = data.split('\n').map(l => l.split('\t'));
  const fields = lines.slice(1).reduce((acc: boolean[], i) => {
    i.forEach((x, n) => {
      if (!isEmpty(x)) {
        acc[n] = true;
      }
    });
    return acc;
  }, fill(Array(lines[0].length), false));
  return lines.map(x => x.filter((_, i) => fields[i]).join('\t')).join('\n');
};

export default cleanEmptyCols;
