import ShareDB from 'sharedb';
import { uuid } from 'frog-utils';
import generateReactiveFn from '../generateReactiveFn';

const share = new ShareDB();
const connection = share.connect();

const createDoc = (initial = {}) =>
  new Promise(resolve => {
    const doc = connection.get('coll', uuid());
    doc.subscribe();
    doc.on('load', () => {
      doc.create(initial);
      resolve(doc);
    });
  });

test('Can get empty doc', () => {
  return createDoc().then(doc => expect(doc.data).toEqual({}));
});

const wrapOps = (ops, initial = {}) =>
  createDoc([]).then(doc => {
    const dataFn = generateReactiveFn(doc);
    ops.forEach(([fn, x]) => dataFn[fn](...x));
    return doc.data;
  });

// array of [initial, [ops], result]
const tests = [
  [[], [['listAppend', ['hi']]], ['hi']],
  [[], [['listAppend', ['hi']], ['listPrepend', ['hello']]], ['hello', 'hi']],
  [[], [['listAppend', ['hi']], ['listPrepend', ['hello']]], ['hello', 'hi']],
  [
    [],
    [
      ['listAppend', ['hi']],
      ['listPrepend', ['hello']],
      ['listDel', ['hello', 0]]
    ],
    ['hi']
  ]
];

tests.forEach(([init, ops, res]) =>
  test(JSON.stringify(res), () =>
    wrapOps(ops, init).then(x => expect(x).toEqual(res))
  )
);
