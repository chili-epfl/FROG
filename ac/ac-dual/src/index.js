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
      title: 'Example',
      config: {
        fr: {
          guidelines:
            'Vous devrez faire 3 tâches, pour une minute chacune: ' +
            '1. Décidez si deux formes sont symétriques (O / N) ' +
            "2. Détruisez la boule qui tombe avant qu'elle ne touche le sol (touches curseur / flèches) " +
            '3. Faites les deux en même temps!'
        },
        en: {
          guidelines:
            'You will have to do 3 tasks, for one minute each:' +
            '1. Decide whether two shapes are symmetrical (Y/N)' +
            '2. Destroy the falling ball before it touches the ground (cursor/arrow keys)' +
            '3. Do both at the same time!'
        },
        delayBetweenActivity: 1500,
        first: 1,
        timeOfEachActivity: 15000,
        gameTime: 10000,
        symmetryTime: 5000,
        symmetryQuestions: 20
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  required: ['fr', 'en'],
  properties: {
    fr: {
      type: 'object',
      title: 'French',
      properties: {
        guidelines: {
          title: 'Directions for Students',
          type: 'string',
          default:
            'Vous devrez faire 3 tâches, pour une minute chacune: ' +
            '1. Décidez si deux formes sont symétriques (O / N) ' +
            "2. Détruisez la boule qui tombe avant qu'elle ne touche le sol (touches curseur / flèches) " +
            '3. Faites les deux en même temps!'
        }
      }
    },
    en: {
      type: 'object',
      title: 'English',
      properties: {
        guidelines: {
          title: 'Directions for Students',
          type: 'string',
          default:
            'You will have to do 3 tasks, for one minute each: <br>' +
            '1. Decide whether two shapes are symmetrical (Y/N)' +
            '2. Destroy the falling ball before it touches the ground (cursor/arrow keys)' +
            '3. Do both at the same time!'
        }
      }
    },
    delayBetweenActivity: {
      title: 'Delay between Activity (ms)',
      type: 'number',
      default: 2000
    },
    first: {
      title:
        'Which activity do you want to go first? 1 - for Game. 2 - for Symmetry',
      type: 'number',
      default: 1
    },
    timeOfEachActivity: {
      title: 'Length of each individual activity',
      type: 'number',
      default: 5000
    },
    gameConfig: {
      title: 'Duration you want to play the game (ms)',
      type: 'number',
      default: 10000
    },
    symmetryTime: {
      title: 'Maximum time to answer each question for symmetry task (ms)',
      type: 'number',
      default: 5000
    },
    symmetryQuestions: {
      title: 'Total number of questions in Symmetry Task',
      type: 'number',
      default: 20
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
  activityState: 0
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
