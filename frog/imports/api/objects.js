// @flow
import type { ObjectT } from 'frog-utils'; // eslint-disable-line
import { uuid } from 'frog-utils'; // eslint-disable-line

import { Objects } from '/imports/collections';

export const addObject = (activityId: string, data: ObjectT) => {
  Objects.update(activityId, data, { upsert: true });
};
