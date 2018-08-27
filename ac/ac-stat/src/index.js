// @flow

import { type ActivityPackageT } from 'frog-utils';
import { isEmpty, isObject } from 'lodash';

import meta from './meta';

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title of the graph?',
      type: 'string'
    },
    plotType: {
      type: 'string',
      title: 'Kind of plot to display:',
      enum: ['all', 'dots', 'box', 'bar'],
      default: 'all'
    },
    sort: {
      type: 'boolean',
      title: 'Sort by 2nd column ?'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// // receives incoming data, and merges it with the reactive data using dataFn.*
// const mergeFunction = ({ data: incoming }, dataFn, data) => {
//   if (Array.isArray(incoming)) {
//     incoming.forEach(item => mergeFunction({ data: item }, dataFn, data));
//     return;
//   }
//   if (isEmpty(incoming) || !isObject(incoming)) {
//     return;
//   }
//   if (!data[incoming.trace]) {
//     dataFn.objInsert({}, incoming.trace);
//     Object.keys(incoming).filter(field => field !== 'trace' && field !== 'filter').forEach(axis =>
//       dataFn.objInsert({data: [], type: axis === incoming.filter ? 'filter' : 'data'}, [incoming.trace, axis])
//     )
//   }
//   Object.keys(incoming).filter(field => field !== 'trace' && field !== 'filter').forEach(axis =>
//     dataFn.listAppend(incoming[axis], [incoming.trace, axis, 'data'])
//   )
// };

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = ({ data: incoming }, dataFn, data) => {
  if (!Array.isArray(incoming)) {
      return;
    }
  incoming.forEach(({trace, ...rest}) => {
    if(!data[trace])
      dataFn.objInsert([],trace)
    dataFn.listAppend({...rest},trace)
  })
};

export default ({
  id: 'ac-stat',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
