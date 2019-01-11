// @flow

import { type productOperatorRunnerT, wrapUnitAll } from 'frog-utils';

const alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const makeCells = (row, cells, readOnly) =>
  cells.map((x, i) => ({
    value: x || '',
    key: alphabet[i + 1] + (row + 1),
    col: i + 1,
    row: row + 1,
    readOnly: i === 0 || !!readOnly
  }));

const operator = (configData, object) => {
  const payload = object.activityData.payload;
  const groups = [];
  const keyvals = {};
  Object.keys(payload).forEach(instance => {
    if (payload[instance].data?.sheet) {
      payload[instance].data.sheet.forEach(row => {
        if (row.find(x => !x.readOnly)) {
          const rawkey = row.find(x => x.col === 1)?.value;
          const val = row.find(x => x.col === 2)?.value;
          const key = rawkey && JSON.stringify(rawkey);
          if (key && val) {
            if (!groups.includes(instance)) {
              groups.push(instance);
            }
            if (!keyvals[key]) {
              keyvals[key] = {};
            }
            keyvals[key][instance] = val;
          }
        }
      });
    }
  });
  const lookupGroups =
    object.activityData.structure === 'individual'
      ? instance => object.globalStructure.students[instance]
      : instance => instance;
  const header = [
    alphabet
      .slice(0, groups.length + 2)
      .map(x => ({ readOnly: true, value: x })),
    makeCells(1, ['1', 'Items', ...groups.map(x => lookupGroups(x))], true)
  ];

  const body = Object.keys(keyvals).map((key, i) => [
    {
      readOnly: true,
      value: i + 2
    },

    ...makeCells(i + 1, [JSON.parse(key), ...groups.map(x => keyvals[key][x])])
  ]);
  return wrapUnitAll({ sheet: [...header, ...body] });
};

export default (operator: productOperatorRunnerT);
