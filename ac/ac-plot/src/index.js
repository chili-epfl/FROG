// @flow

import { type ActivityPackageT } from 'frog-utils';
import { isEmpty, isObject } from 'lodash';

import ActivityRunner from './ActivityRunner';
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

const dataStructure = [];

const mergeFunction = ({ data }, dataFn) => {
  if (isEmpty(data) || !isObject(data)) {
    return;
  }
  Object.values(data).forEach(trace => {
    if (Array.isArray(trace))
      dataFn.listAppend({
        x: trace.map(p => (Array.isArray(p) ? p[0] : 0)),
        y: trace.map(p => (Array.isArray(p) ? p[1] : 0))
      });
  });
};

export default ({
  id: 'ac-plot',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  ActivityRunner,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
