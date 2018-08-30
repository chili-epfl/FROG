// @flow

import { type ActivityPackageT } from 'frog-utils';
import { isEmpty, isObject } from 'lodash';

const meta = {
  name: 'Spreadsheet',
  shortDesc: 'Spreadsheet/table',
  description: 'Supports some calculations',
  exampleData: [
    {
      title: 'log 100 points and linear',
      config: { rows: 20, columns: 3 },
      data: [
        { trace: 'AluminumGlass', y: 30 },
        { trace: 'AluminumGlass', y: 20 },
        { trace: 'AluminumGlass', y: 30 },
        { trace: 'AluminumGlass', y: 20 },
        { trace: 'AluminumGlass', y: 30 },
        { trace: 'AluminumGlass', y: 20 },
        { trace: 'AluminumGlass', y: 30 },
        { trace: 'AluminumGlass', y: 3 },
        { trace: 'AluminumGlass', y: 5 },
        { trace: 'AluminumGlass', y: 7 },
        { trace: 'AluminumGlass', y: 9 },
        { trace: 'AluminumGlass', y: 11 },
        { trace: 'AluminumGlass', y: 12 },
        { trace: 'AluminumGlass', y: 13 },
        { trace: 'WoodSlow', y: 3 },
        { trace: 'WoodSlow', y: 2 },
        { trace: 'WoodSlow', y: 3 },
        { trace: 'WoodSlow', y: 2 },
        { trace: 'WoodSlow', y: 3 },
        { trace: 'WoodSlow', y: 2 },
        { trace: 'WoodSlow', y: 3 },
        { trace: 'WoodSlow', y: 3 },
        { trace: 'WoodSlow', y: 5 },
        { trace: 'WoodSlow', y: 7 },
        { trace: 'WoodSlow', y: 9 },
        { trace: 'WoodSlow', y: 11 },
        { trace: 'WoodSlow', y: 12 },
        { trace: 'WoodSlow', y: 13 }
      ]
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    rows: { title: 'Number of rows?', type: 'number', default: 4 },
    columns: { title: 'Number of columns?', type: 'number', default: 4 }
  }
};

const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const dataStructure = formdata =>
  Array((formdata.rows || 4) + 1)
    .fill(0)
    .map((_, i) =>
      alphabet.slice(0, (formdata.columns || 4) + 1).map((col, j) => {
        if (i === 0 && j === 0) {
          return { readOnly: true, value: '                ' };
        }
        if (i === 0) {
          return { readOnly: true, value: col };
        }
        if (j === 0) {
          return { readOnly: true, value: i };
        }
        return { value: '', key: col + i, col: j, row: i };
      })
    );

const mergeFunction = ({ data: incoming }, dataFn, data) => {
  if (Array.isArray(incoming)) {
    incoming.forEach(item => mergeFunction({ data: item }, dataFn, data));
  }
  if (isEmpty(incoming) || !isObject(incoming)) {
    return;
  }
  if (incoming['1']) {
    mergeFunction({ data: incoming['1'] }, dataFn, data);
  }
  if (incoming.y) {
    const indexRaw = data[1].findIndex(x => x.value === incoming.trace);
    const index = indexRaw === -1 ? undefined : indexRaw;
    let newIdx;
    if (!index) {
      newIdx = data[1].findIndex(x => x.value === '');
      dataFn.objInsert(incoming.trace, [1, newIdx, 'value']);
    }

    const colIdx = data.findIndex(x => x[index || newIdx].value === '');

    dataFn.objInsert(incoming.y, [colIdx, index || newIdx, 'value']);
  }
};

export default ({
  id: 'ac-spreadsheet',
  type: 'react-component',
  configVersion: 1,
  meta,
  mergeFunction,
  config,
  dataStructure
}: ActivityPackageT);
