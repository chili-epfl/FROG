// @flow

import { orchestrationControl } from './orchestrationControl';

export const actions = (session: Object) => ({
  sessionControl: orchestrationControl(session)
});
