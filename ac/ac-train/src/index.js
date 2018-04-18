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
        instanceCount: 5,
        intervalTime: 1000
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachInstance: 10000,
        instanceCount: 5,
        intervalTime: 1000
      },
      data: {}
    },
    {
      title: 'Supersonic',
      config: {
        timeOfEachInstance: 1500,
        instanceCount: 5,
        intervalTime: 500
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
    },
    intervalTime: {
      title: 'Time to show ticket validation status',
      type: 'number',
      default: 2000
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
