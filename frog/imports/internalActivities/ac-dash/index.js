// @flow

import type { ActivityPackageT } from 'frog-utils';
import Loadable from 'react-loadable';
import path from 'path';

const ConfigComponent = Loadable({
  loader: () => import('./config.js'),
  loading: () => null,
  serverSideRequirePath: path.resolve(__dirname, './config.js')
});

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing',
  preview: false
};

export default ({
  id: 'ac-dash',
  type: 'react-component',
  configVersion: 1,
  config: {},
  ConfigComponent,
  meta
}: ActivityPackageT);
