// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './Proximity';

const meta = {
  name: 'Proximity',
  type: 'react-component',
  shortDesc: 'Manualy create group',
  description:
    'Gives the possibility for students to make their own group if followed by the prox operator',
  exampleData: [{ title: 'Case with no data', config: {}, data: {} }]
};

const config = {
  type: 'object',
  properties: {
    maxByGrp: {
      title: 'Maximum number of students in a group (Optional)',
      type: 'number'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert([], 'students');
  dataFn.objInsert([], 'groups');
};

export default ({
  id: 'ac-prox',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
