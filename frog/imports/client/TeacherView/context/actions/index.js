// @flow

import { orchestrationControl } from './orchestrationControl';
import { openViews } from './openViews';
import { exportActions } from './exportActions';
import { settingActions } from './settingActions';

export const actions = (session: Object) => ({
  ...orchestrationControl(session),
  ...openViews(session),
  ...exportActions(session),
  ...settingActions(session)
});
