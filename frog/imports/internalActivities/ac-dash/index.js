// @flow

import path from 'path';
import { type ActivityPackageT, Loadable } from 'frog-utils';

const ConfigComponent = Loadable({
  loader: () => import('./config.js'),
  loading: () => null,
  serverSideRequirePath: path.resolve(__dirname, './config.js'),
  componentDescription: 'configComponent'
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
