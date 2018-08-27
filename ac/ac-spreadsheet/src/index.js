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
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = [0, 1, 2, 3, 4].map((row, i) =>
  ['', 'A', 'B', 'C', 'D'].map((col, j) => {
    if (i === 0 && j === 0) {
      return { readOnly: true, value: '                ' };
    }
    if (row === 0) {
      return { readOnly: true, value: col };
    }
    if (j === 0) {
      return { readOnly: true, value: row };
    }
    return { value: '', key: col + row, col: j, row: i };
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
