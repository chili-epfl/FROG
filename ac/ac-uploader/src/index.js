// @flow

import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'File Uploader',
  type: 'react-component',
  shortDesc: 'File Uploader',
  description: 'Allow any student to upload files in the database'
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title ?',
      type: 'string'
    },
    topic: {
      title: 'What is it about ?',
      type: 'string'
    },
    maxNumbFile: {
      title: 'Maximum number of file by instance (10 by default)',
      type: 'number'
    }
  }
};

export default ({
  id: 'ac-uploader',
  type: 'react-component',
  configVersion: 1,
  meta,
  config
}: ActivityPackageT);
