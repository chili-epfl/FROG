// @flow

import { type ActivityPackageT, values, entries } from 'frog-utils';
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

const mergeFunction = ({ data: incomingData }, dataFn, data) => {
  if (!incomingData) {
    return;
  }

  const toInsert = {};
  const prepareMergeItem = (item: { trace: string, x: number, y: number }) => {
    if (item && !isEmpty(item) && isObject(item)) {
      const { x, y, trace } = item;
      if (x !== undefined && y !== undefined && trace) {
        toInsert[trace] = toInsert[trace] || { x: [], y: [] };
        toInsert[trace].x.push(x);
        toInsert[trace].y.push(y);
      }
    }
  };

  // These allow the merge function to accept Arrays of
  // datapoints or an object datapoints as values
  if (Array.isArray(incomingData)) {
    incomingData.forEach(prepareMergeItem);
  } else {
    values(incomingData).forEach(prepareMergeItem);
  }

  // Uses dataFn to asynchronously insert the prepared data
  entries(toInsert).forEach(([trace, { x, y }]) => {
    if (!data[trace]) {
      dataFn.objInsert({ x, y }, trace);
    } else {
      x.forEach(el => dataFn.listAppend(el, [trace, 'x']));
      y.forEach(el => dataFn.listAppend(el, [trace, 'y']));
    }
  });
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
