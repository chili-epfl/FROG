// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const meta = {
  name: 'Train Activity',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Normal',
      config: {
        timeOfEachInstance: 30000
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachInstance: 15000
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  required: ['timeOfEachInstance'],
  properties: {
    timeOfEachInstance: {
      title: 'Length of each individual activity',
      type: 'number',
      default: 10000
    }
  }
};

const dataStructure = {
  progress: 0,
  score: 0,
  time: 0,
  step: 0,
  helpCounter: 0
};

export default ({
  id: 'ac-train',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
