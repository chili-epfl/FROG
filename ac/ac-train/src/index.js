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
        timeOfEachActivity: 30000
      },
      data: {}
    },
    {
      title: 'Quick',
      config: {
        timeOfEachActivity: 15000
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  required: ['timeOfEachActivity', 'symmetryTime'],
  properties: {
    timeOfEachActivity: {
      title: 'Length of each individual activity',
      type: 'number',
      default: 6000
    }
  }
};

const dataStructure = {
  progress: 0,
  score: 0,
  time: 0,
  step: 0
};

export default ({
  id: 'ac-dual',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
