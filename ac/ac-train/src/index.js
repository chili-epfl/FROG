// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboards';

const meta = {
  name: 'Train Activity',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Slow',
      config: {
        timeOfEachInstance: 60000,
        instanceCount: 5
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachInstance: 10000,
        instanceCount: 5
      },
      data: {}
    },
    {
      title: 'Play with fire',
      config: {
        timeOfEachInstance: 3000,
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
  time: 0,
  step: 0,
  guidelines: true,
  instance: 0
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
