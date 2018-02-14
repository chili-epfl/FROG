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
          'This lab intends to measure some phenomena in human cognition. ' +
          'A sentence will appear on the screen. Type Y (or use the Yes button' +
          ") if the sentence's meaning is correct, or N (or the No button) " +
          'if it is not. The sentences make use of basic colors.',
        objects: 'lemons,wood,blood,grass,the sky',
        colors: 'yellow,brown,red,green,blue',
        delay: 3000,
        maxTime: 5000,
        maxQuestions: 20
      },
      data: {}
    },
    {
      title: 'Be quick',
      config: {
        guidelines: 'Hurry!',
        objects: 'lemons,wood,blood,grass,the sky',
        colors: 'yellow,brown,red,green,blue',
        delay: 100,
        maxTime: 1000,
        maxQuestions: 5
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  required: ['objects','colors'],
  properties: {
    guidelines: {
      title: 'Directions for Students',
      type: 'string',
      default:
        'A sentence will appear on the screen. Type Y (or use the Yes button' +
        ") if the sentence's meaning is correct, or N (or the No button) " +
        'if it is not. The sentences make use of basic colors.'
    },
    objects: {
      title: 'Semantic objects for sentences',
      type: 'string'
    },
    colors: {
      title: 'Color of previous objects (in same order)',
      type: 'string'
    },
    delay: {
      title: 'Delay between questions (ms)',
      type: 'number',
      default: 3000
    },
    maxTime: {
      title: 'Maximum time to answer question (ms)',
      type: 'number',
      default: 5000
    },
    maxQuestions: {
      title: 'Total number of questions',
      type: 'number',
      default: 20
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  progress: 0,
  score: 0
};

export default ({
  id: 'ac-stroop',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
