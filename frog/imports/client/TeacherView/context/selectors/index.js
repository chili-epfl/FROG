// @flow

import { sessionState } from './sessionState';

export const selectors = (session: Object) => ({
  sessionState: sessionState(session)
});
