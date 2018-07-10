// @flow
import type { ActivityPackageT } from 'frog-utils';

import ConfigComponent from './ConfigComponent';
import dashboards from './Dashboard';

export const meta = {
  name: 'H5P activity',
  shortDesc: 'Upload a fully configured H5P activity',
  description: 'Displays H5P activity, and logs xAPI statements'
};

export default ({
  id: 'ac-h5p',
  type: 'react-component',
  version: 1,
  ConfigComponent,
  dashboards,
  config: {
    type: 'object',
    required: ['component'],
    properties: {
      prompt: { type: 'string', title: 'Prompt' },
      component: {
        type: 'object',
        title: 'H5P file',
        required: ['fileId'],
        properties: { fileId: { type: 'string', title: 'H5P file' } }
      }
    }
  },
  meta
}: ActivityPackageT);
