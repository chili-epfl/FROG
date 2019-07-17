// @flow

import { shuffle } from 'lodash';

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');
export const getSlug = (n: number) =>
  shuffle(groupchars)
    .slice(0, n)
    .join('');
