// @flow

import path from 'path';
import { type ActivityPackageT, Loadable } from '/imports//imports/frog-utils';

const ConfigComponent = Loadable({
  loader: () => import('./config.js'),
  loading: () => null,
  serverSideRequirePath: path.resolve(__dirname, './config.js'),
  componentDescription: 'configComponent'
});

const meta = {
  name: 'Wiki page',
  shortDesc: 'Show a wiki page from an arbitrary wiki',
  description: '',
  category: 'Core tools'
};

const validateConfig = [
  formData => {
    if (!formData?.component?.wiki || !formData?.component?.page) {
      return { err: 'You need to choose a wiki and a page' };
    } else {
      return null;
    }
  }
];

export default ({
  id: 'ac-wiki',
  type: 'react-component',
  configVersion: 1,
  config: {},
  validateConfig,
  ConfigComponent,
  meta
}: ActivityPackageT);
