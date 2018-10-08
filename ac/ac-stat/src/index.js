// @flow

import { type ActivityPackageT, values } from 'frog-utils';

import upgradeFunctions from './upgradeFunctions';
import meta from './meta';

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title of the graph?',
      type: 'string'
    },
    plotTypes: {
      type: 'array',
      title: 'Plots to display',
      default: ['dots', 'box', 'histogram'],
      items: {
        type: 'string',
        enum: ['dots', 'box', 'histogram']
      },
      uniqueItems: true
    },
    doubleView: { type: 'boolean', title: 'Show two analysis components?' },
    summary: {
      type: 'boolean',
      title: 'Show statistical summary below graph?'
    },
    editable: {
      type: 'boolean',
      title: 'Are students able to edit the table?'
    },
    showTransformations: { type: 'boolean', title: 'Show transformations' },
    sortData: { type: 'boolean', title: 'Sort data' },
    fixAxis: { type: 'boolean', title: 'Should the axis be fixed?' },
    dataSets: { type: 'string', title: 'Datasets' }
  }
};

const configUI = {
  dataSets: { 'ui:widget': 'textarea' },
  plotTypes: {
    'ui:widget': 'checkboxes'
  }
};
const validateConfig = [
  form => {
    if (!form.dataSets || form.dataSets.trim() === '') {
      return null;
    }
    try {
      const data = JSON.parse(form.dataSets);
      data.forEach(x => {
        if (!x.trace) {
          return { err: 'Not valid dataset, missing trace' };
        }
      });
      return null;
    } catch (e) {
      console.error(e);
      return { err: 'Not valid dataset' };
    }
  }
];

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

const mergeFunction = (object, dataFn, data) => {
  const { data: incoming, config: configObj } = object;

  let dataset = [];
  if (configObj.dataSets) {
    dataset = JSON.parse(configObj.dataSets);
  }
  [...(incoming || []), ...dataset].forEach(({ trace, ...rest }) => {
    if (!data[trace]) dataFn.objInsert({ columns: [], values: [] }, trace);
    const tmpEntry = [];
    Object.keys(rest).forEach(key => {
      if (!data[trace].columns.includes(key))
        dataFn.listAppend(key, [trace, 'columns']);
      tmpEntry.push(rest[key]);
    });
    dataFn.listAppend(tmpEntry, [trace, 'values']);
  });

  const { originalData, ...datasets } = data;
  if (Object.keys(datasets).length > 1)
    dataFn.objInsert(
      {
        columns: [values(datasets)[0].columns[0], 'dataset'],
        values: Object.keys(datasets).reduce(
          (acc, cur) => [
            ...acc,
            ...datasets[cur].values.map(entry => [entry[0], cur])
          ],
          []
        )
      },
      'all datasets'
    );

  dataFn.objInsert(data, 'originalData');
};

export default ({
  id: 'ac-stat',
  type: 'react-component',
  configVersion: 2,
  meta,
  config,
  configUI,
  dashboard: null,
  upgradeFunctions,
  dataStructure,
  mergeFunction,
  validateConfig
}: ActivityPackageT);
