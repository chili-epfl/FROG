// @flow

import { type ActivityPackageT } from 'frog-utils';

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
    doubleView: { type: 'boolean', title: 'Show two analysis components?' },
    summary: {
      type: 'boolean',
      title: 'Show statistical summary below graph?'
    },
    editable: { type: 'boolean', title: 'Are students able to edit the table?' }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

const mergeFunction = ({ data: incoming }, dataFn, data) => {
  if (!Array.isArray(incoming)) {
    return;
  }
  incoming.forEach(({ trace, ...rest }) => {
    if (!data[trace]) dataFn.objInsert({ columns: [], values: [] }, trace);
    const tmpEntry = [];
    Object.keys(rest).forEach(key => {
      if (!data[trace].columns.includes(key))
        dataFn.listAppend(key, [trace, 'columns']);
      tmpEntry.push(rest[key]);
    });
    dataFn.listAppend(tmpEntry, [trace, 'values']);
  });

  const {originalData,...datasets} = data
  if(Object.keys(datasets).length > 1)
    dataFn.objInsert(({
      columns: [Object.values(datasets)[0].columns[0], 'dataset'],
      values: Object.keys(datasets).reduce((acc,cur) => [...acc, ...datasets[cur].values.map(entry => [entry[0], cur])]
    ,[])
  })
    , 'all datasets')

  dataFn.objInsert(data, 'originalData');
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
