// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const meta = {
  name: 'Stroop Effect',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Example with 5 objects',
      config: {
        guidelines:
          'Click Yes or No only when the sentence is correct. You can also use Y and N on the keyboard',
        objects: 'lemons,wood,a tomato,grass,the sky',
        colors: 'yellow,brown,red,green,blue',
        delay: 2000,
        maxQuestions: 20
      },
      data: {}
    },
    {
      title: 'Be quick',
      config: {
        guidelines: 'Hurry!',
        objects: 'lemons,wood,a tomato,grass,the sky',
        colors: 'yellow,brown,red,green,blue',
        delay: 100,
        maxQuestions: 5
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    guidelines: {
      title: 'Guidelines',
      type: 'string',
      default: 'Answer the questions'
    },
    objects: {
      title: 'Comma separated objects',
      type: 'string'
    },
    colors: {
      title: 'Color of previous objects (in same order)',
      type: 'string'
    },
    delay: {
      title: 'Delay between questions (ms)',
      type: 'number',
      default: 2000
    },
    maxQuestions: {
      title: 'Total number of questions',
      type: 'number',
      default: 20
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { progress: 0 };


export default ({
  id: 'ac-stroop',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
