// @flow

import { isEqual } from 'lodash';

export const isEqualLI = (li1: Object, li2: Object): boolean =>
  typeof li1.li === 'string' ? li1.li === li2.li : isEqual(li1.li, li2.li);
