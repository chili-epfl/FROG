// @flow

import type { ActivityPackageT } from 'frog-utils';
import { config, validateConfig } from './config';

const meta = {
  name: 'Simple form',
  shortDesc: 'Form with text fields',
  description:
    'Creates a form with specified text fields, optionally allow students to submit multiple forms.',
  exampleData: [
    {
      title: 'Sample form',
      config: {
        questions:
          'What is the capital or Iraq?,How many people live in the Niger delta?',
        multiple: false
      },
      activityData: {}
    },
    {
      title: 'Allow multiple submissions',
      config: {
        questions: 'How can we improve the environment?',
        multiple: true
      },
      activityData: {}
    }
  ]
};

export default ({
  id: 'ac-form',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  validateConfig
}: ActivityPackageT);
