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
        timeOfEachInstance: 10000,
        instanceCount: 5
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachInstance: 5000,
        instanceCount: 5
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  required: ['timeOfEachInstance', 'instanceCount'],
  properties: {
    timeOfEachInstance: {
      title: 'Length of each individual instance',
      type: 'number',
      default: 10000
    },
    instanceCount: {
      title: 'Number of instances per interface',
      type: 'number',
      default: 5
    }
  }
};

const dataStructure = {
  progress: 0,
  score: 0,
  time: 0,
  step: 0,
  guidelines: true,
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
