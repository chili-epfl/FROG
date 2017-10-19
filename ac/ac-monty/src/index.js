// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'Monty',
  type: 'react-component',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  if (object.data) {
    Object.keys(object.data)
      .map(k => object.data[k])
      .filter(x => x && x.key && x.selected)
      .forEach(x => dataFn.objInsert(x, x.key));
  }
};

export default ({
  id: 'ac-monty',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
