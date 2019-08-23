// @flow

import { sessionState } from './sessionState';
import { steps } from './steps';
import { studentState } from './students';

export const selectors = (
  session: Object,
  activities: Object,
  students: Object
) => ({
  ...sessionState(session),
  ...steps(session, activities),
  ...studentState(students)
});
