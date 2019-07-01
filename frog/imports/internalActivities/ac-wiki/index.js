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
  name: 'Wiki page',
  shortDesc: 'Show a wiki page from an arbitrary wiki',
  description:
    '',
  category: 'Core tools',
  preview: false
};

export default ({
  id: 'ac-wiki',
  type: 'react-component',
  configVersion: 1,
  config: {},
  ConfigComponent,
  meta
}: ActivityPackageT);
