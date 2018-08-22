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
      enum: ['all', 'lines', 'dots', 'dots+lines', 'box', 'bar'],
      default: 'all'
    },
    xLabel: {
      title: 'X label',
      type: 'string',
      default: 'x'
    },
    yLabel: {
      title: 'Y label',
      type: 'string',
      default: 'y'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = ({ data: incoming }, dataFn, data) => {
  if (Array.isArray(incoming)) {
    incoming.forEach(item => mergeFunction({ data: item }, dataFn, data));
    return;
  }
  if (isEmpty(incoming) || !isObject(incoming)) {
    return;
  }
  if (!data[incoming.trace]) {
    dataFn.objInsert({ y: [], x: [] }, incoming.trace);
  }
  if (incoming.y) {
    dataFn.listAppend(incoming.y, [incoming.trace, 'y']);
  }
  if (incoming.x) {
    dataFn.listAppend(incoming.x, [incoming.trace, 'x']);
  }
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
