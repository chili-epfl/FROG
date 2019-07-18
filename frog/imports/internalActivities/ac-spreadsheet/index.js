// @flow

import { type ActivityPackageT, values } from 'frog-utils';
import { isEmpty, isObject } from 'lodash';
import meta from './meta';

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    rows: { title: 'Number of rows?', type: 'number', default: 4 },
    columns: { title: 'Number of columns?', type: 'number', default: 4 },
    addRemove: {
      title: 'Enable adding/removing columns/rows?',
      type: 'boolean',
      default: true
    }
  }
};

const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const dataStructure = formdata => ({
  sheet: Array((formdata.rows || 4) + 1)
    .fill(0)
    .map((_, i) =>
      alphabet.slice(0, (formdata.columns || 4) + 1).map((col, j) => {
        if (i === 0 && j === 0) {
          return { readOnly: true, value: '                ' };
        }
        if (i === 0) {
          return {
            readOnly: true,
            value: col
          };
        }
        if (j === 0) {
          return { readOnly: true, value: i };
        }
        return { value: '', key: col + i, col: j, row: i };
      })
    )
});

const generateOneRow = (cols, row) =>
  alphabet.slice(0, cols + 1).map((i, j) => {
    if (j === 0) {
      return { readOnly: true, value: row };
    }
    return { value: '', key: i + row + '', col: j, row };
  });

const mergeFunction = (
  { data: incoming, config: configData },
  dataFnRaw,
  dataRaw
) => {
  if (!incoming) {
    return;
  }
  if (incoming.sheet) {
    return dataFnRaw.objInsert(incoming.sheet, 'sheet');
  }
  if (Array.isArray(incoming)) {
    return incoming.forEach(item =>
      mergeFunction({ data: item, config: configData }, dataFnRaw, dataRaw)
    );
  }
  if (isEmpty(incoming) || !isObject(incoming)) {
    return;
  }
  if (isObject(incoming) && !incoming.li && !incoming.trace) {
    return values(incoming).forEach(item =>
      mergeFunction({ data: item, config: configData }, dataFnRaw, dataRaw)
    );
  }

  if (incoming['1']) {
    return mergeFunction(
      { data: incoming['1'], config: configData },
      dataFnRaw,
      dataRaw
    );
  }
  const data = dataRaw.sheet;
  const dataFn = dataFnRaw.specialize('sheet');

  if (incoming.y || incoming.li) {
    const indexRaw = data[1].findIndex(
      x => x.value === (incoming.trace || 'Items')
    );
    const index = indexRaw === -1 ? undefined : indexRaw;
    let newIdx;
    if (!index) {
      newIdx = data[1].findIndex(x => x.value === '');
      dataFn.objInsert(incoming.trace || 'Items', [1, newIdx, 'value']);
    }

    const colIdxRaw = data.findIndex(x => x[index || newIdx].value === '');
    const colIdxBool = colIdxRaw === -1 ? undefined : colIdxRaw;
    let newIndex;
    if (!colIdxBool) {
      newIndex = data.length;
      const newRow = generateOneRow(configData.columns || 4, data.length);
      dataFn.listAppend(newRow);
    }
    const colIdx = colIdxBool || newIndex;
    if (incoming.y) {
      dataFn.objInsert(incoming.y, [colIdx, index || newIdx, 'value']);
    } else if (incoming.li) {
      dataFn.objInsert({ li: incoming.li }, [colIdx, index || newIdx, 'value']);

      dataFn.objInsert(true, [colIdx, index || newIdx, 'readOnly']);
    }
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
