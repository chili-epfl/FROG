// @flow

import { values, entries } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const names = { stian: 21, peter: 22 };
const arys = { stian: [1, 2, 3], peter: [1, 2, 3] };

values(names).map(x => x * 3);
values(names).map(x => x.length);
values(arys).map(x => x());
values(arys).map(x => x * 3);
entries(arys).map(([_, v]) => v * 3);
entries(names).map(([_, v]) => v * 3);

const meta = {
  name: 'Stroop Effect',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Example with 5 objects',
      config: {
        fr: {
          guidelines:
            'Cette activité cherche à mesurer un phénomène cognitif ' +
            "Une phrase va apparaître a l'écran. Presse O (ou bien utilise " +
            "le bouton 'Oui') si la pharse est vraie, ou bien N (ou bien le " +
            "bouton 'non') si la phrase est fausse.",
          objects: "d'un citron,du bois,du sang,du gazon,du ciel",
          colors: 'jaune,marron,rouge,vert,bleu'
        },
        en: {
          guidelines:
            'This lab intends to measure some phenomena in human cognition. ' +
            'A sentence will appear on the screen. Type Y (or use the Yes' +
            " button) if the sentence's meaning is correct, or N (or the No " +
            'button) if it is not. The sentences make use of basic colors.',
          objects: 'lemons,wood,blood,grass,the sky',
          colors: 'yellow,brown,red,green,blue'
        },
        delay: 1500,
        maxTime: 5000,
        maxQuestions: 20
      },
      data: {}
    },
    {
      title: 'Be quick',
      config: {
        fr: {
          guidelines: 'Dépèche toi!',
          objects: "d'un citron,du bois,du sang,du gazon,du ciel",
          colors: 'jaune,marron,rouge,vert,bleu'
        },
        en: {
          guidelines: 'Hurry!',
          objects: 'lemons,wood,blood,grass,the sky',
          colors: 'yellow,brown,red,green,blue'
        },
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
  required: ['fr', 'en'],
  properties: {
    fr: {
      required: ['objects', 'colors'],
      type: 'object',
      title: 'French',
      properties: {
        guidelines: {
          title: 'Directions for Students',
          type: 'string',
          default:
            'Cette activité cherche à mesurer un phénomène cognitif ' +
            "Une phrase va apparaître a l'écran. Presse O (ou bien utilise " +
            "le bouton 'Oui') si la pharse est vraie, ou bien N (ou bien le " +
            "bouton 'non') si la phrase est fausse."
        },
        objects: {
          title: 'Semantic objects for sentences',
          type: 'string'
        },
        colors: {
          title: 'Color of previous objects (in same order)',
          type: 'string'
        }
      }
    },
    en: {
      type: 'object',
      required: ['objects', 'colors'],
      title: 'English',
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

export default {
  id: 'ac-stroop',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure
};
