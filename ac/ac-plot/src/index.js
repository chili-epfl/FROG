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

const dataStructure = {};

const mergeFunction = ({ data: incoming }, dataFn, data) => {
  if (Array.isArray(incoming)) {
    incoming.forEach(item => mergeFunction({ data: item }, dataFn, data));
    return;
  }
  if (isEmpty(incoming) || !isObject(incoming)) {
    return;
  }
  if (incoming['1']) {
    mergeFunction({ data: incoming['1'] }, dataFn, data);
  }
  if (incoming.y) {
    if (!data[incoming.trace]) {
      dataFn.objInsert({ y: [] }, incoming.trace);
    }
    dataFn.listAppend(incoming.y, [incoming.trace, 'y']);
  }
  if (incoming.x) {
    if (!data[incoming.trace]) {
      dataFn.objInsert({ x: [] }, incoming.trace);
    }
    if (!data[incoming.trace].x) {
      dataFn.objInsert({ x: [] }, incoming.trace);
    }
    dataFn.listAppend(incoming.x, [incoming.trace, 'x']);
  }
};

export default ({
  id: 'ac-plot',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
