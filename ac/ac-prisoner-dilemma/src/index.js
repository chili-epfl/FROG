// @flow

import { type ActivityPackageT } from 'frog-utils';
import dashboards from './dashboard';

const meta = {
  name: "Prisoner's dilemma",
  shortDesc: "Two player prisoner's dilemma",
  description:
    'Uses the "standard" gain matrix, while the number of rounds can be customized. Additional group members will be spectators.',
  exampleData: []
};

const config = {
  type: 'object',
  required: ['rounds'],
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    rounds: {
      title: 'Number of rounds',
      type: 'number',
      default: 2
    }
  }
};

const dataStructure = {
  students: {},
  rounds: {
    '0': {}
  },
  phase: 0
};

export default ({
  id: 'ac-prisoner-dilemma',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards,
  dataStructure
}: ActivityPackageT);
