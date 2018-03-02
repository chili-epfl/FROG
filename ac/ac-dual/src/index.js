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
        delay: 1500,
        maxTime: 5000,
        maxQuestions: 20
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
    delay: {
      title: 'Delay between questions (ms)',
      type: 'number',
      default: 2000
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
  score: 0,
  time: 0
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
