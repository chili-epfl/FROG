// @flow

import { sessionState } from './sessionState';
import { steps } from './steps';

export const selectors = (session: Object, activities: Object) => ({
  ...sessionState(session),
  ...steps(session, activities)
});
