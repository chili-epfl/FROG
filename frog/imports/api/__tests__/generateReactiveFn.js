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
test('Can get empty doc', () => {
  return createDoc([]).then(doc => {
    const dataFn = generateReactiveFn(doc);
    dataFn.listAppend('hello');
    expect(doc.data).toEqual(['hello']);
    dataFn.listAppend('hello');
    expect(doc.data).toEqual(['hello', 'hello']);
    dataFn.listPrepend('hi');
    expect(doc.data).toEqual(['hi', 'hello', 'hello']);
  });
});
