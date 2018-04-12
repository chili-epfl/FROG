// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const meta = {
  name: 'Dual Activity',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Quick',
      config: {
        timeOfEachActivity: 15000,
        symmetryTime: 3000
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
      default: 60000
    },
    symmetryTime: {
      title: 'Maximum time to answer each question for symmetry task (ms)',
      type: 'number',
      default: 5000
    }
  }
};

// const configUI = {
//   symmetryQuestions: { conditional: formdata => formdata.mode === 'symmetry' }
// };

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  progress: 0,
  score: 0,
  time: 0,
  step: 0
};

// the actual component that the student sees

export default ({
  id: 'ac-dual',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
