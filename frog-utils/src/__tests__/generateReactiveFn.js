import ShareDB from 'sharedb';
import { uuid } from '..';
import { generateReactiveFn } from '../generateReactiveFn';

const share = new ShareDB();
const connection = share.connect();

// eslint-disable-next-line
const createDoc = (initial = {}) =>
  new Promise(resolve => {
    const doc = connection.get('coll', uuid());
    doc.subscribe();
    doc.on('load', () => {
      doc.create(initial);
      resolve(doc);
    });
  });

/* eslint-enable */

test('Can get empty doc', () =>
  createDoc().then(doc => expect(doc.data).toEqual({})));

// eslint-disable-next-line
const wrapOps = (ops, initial = {}) =>
  createDoc(initial).then(doc => {
    const dataFn = generateReactiveFn(doc);
    ops.forEach(([fn, x]) => dataFn[fn](...x));
    return doc.data;
  });

// array of [initial, [ops], result]
const tests = [
  [[], [['listAppend', ['hi']]], ['hi']],
  [[], [['listAppend', ['hi']], ['listPrepend', ['hello']]], ['hello', 'hi']],
  [[], [['listAppend', ['hi']], ['listAppend', ['hello']]], ['hi', 'hello']],
  [
    [],
    [
      ['listAppend', ['hi']],
      ['listPrepend', ['hello']],
      ['listDel', ['hello', 0]]
    ],
    ['hi']
  ],
  [['1', '2', '3'], [['listInsert', ['2', 1]]], ['1', '2', '2', '3']],
  [['1', '2', '3'], [['listDel', ['2', 1]]], ['1', '3']],
  [['1', '2', '3'], [['listDel', ['3', 1]]], ['1', '3']]
];

tests.forEach(([init, ops, res]) =>
  test(JSON.stringify(res), () =>
    wrapOps(ops, init).then(x => expect(x).toEqual(res))
  )
);
