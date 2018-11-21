// @flow

import { type ActivityPackageT } from 'frog-utils';
import dashboards from './dashboard';

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
  required: ['rounds'],
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    rounds: {
        title: 'Number of rounds',
        type: 'number'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
    students: {},
    rounds: {
        0: {}
    },
    phase: 0
};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

export default ({
  id: 'ac-prisoner-dilemma',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards,  //TODO dashboradS {default: DashboardComponent}
  dataStructure,
  mergeFunction
}: ActivityPackageT);
