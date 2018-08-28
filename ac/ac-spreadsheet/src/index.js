// @flow

import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Spreadsheet',
  shortDesc: 'Spreadsheet/table',
  description: 'Supports some calculations',
  exampleData: []
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

export default ({
  id: 'ac-spreadsheet',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dataStructure
}: ActivityPackageT);
