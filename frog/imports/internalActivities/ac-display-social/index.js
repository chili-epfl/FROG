// @flow

import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Display social attribute',
  shortName: 'Display social',
  shortDesc: 'Display the social attribute chosen',
  description: '',
  category: 'Core tools',
  exampleData: [
    {
      title: 'Basic case',
      config: { title: 'Please find your groups' },
      data: {}
    },

    {
      title: 'Basic case with name',
      config: { title: 'Please find your groups', displayName: true },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    displayName: {
      title: 'Display user name in message?',
      type: 'boolean'
    },
    displayGroup: {
      title: 'Display the names of all the students in the group?',
      type: 'boolean'
    }
  }
};

const dataStructure = [];

export default ({
  id: 'ac-display-social',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dataStructure
}: ActivityPackageT);
