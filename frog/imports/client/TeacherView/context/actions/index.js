// @flow

import { orchestrationControl } from './orchestrationControl';

export const actions = (session: Object) => ({
  ...orchestrationControl(session)
});
