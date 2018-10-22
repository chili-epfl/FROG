// @flow

import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Prisoner dilemma',
  shortDesc: 'Prisoner dilemma component',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  required: ['rounds', 'gainMatrix'],
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    rounds: {
        title: 'Number of rounds',
        type: 'number'
    },
    gainMatrix: {
        title: 'Gain Matrix',
        type: 'object',
        required: ['cooperateCooperate', 'cheatCheat', 'cooperateCheat', 'cheatCooperate'],
        properties: {
            cooperateCooperate: {
                title: 'Score if both players cooperate',
                type: 'number'
            },
            cheatCheat: {
                title: 'Score if both players cheat',
                type: 'number'
            },
            cooperateCheat: {
                title: 'Score if player cooperates and adversary cheats',
                type: 'number'
            },
            cheatCooperate: {
                title: 'Score if player cheats and adversary cooperates',
                type: 'number'
            }
        }
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

export default ({
  id: 'ac-prisoner-dilemma',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
