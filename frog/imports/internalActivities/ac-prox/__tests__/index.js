import pkg from '../index';

const object2 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  }
};

const item = {
  students: {
    '1': 'a',
    '2': 'a',
    '3': 'b',
    '4': 'b',
    '5': 'c',
    '6': 'c'
  },
  groups: { a: '1', b: '2', c: '3' }
};

test('test overflow distribute', () =>
  expect(
    pkg.formatProduct({ distributeStudents: true }, item, null, null, object2)
  ).toMatchSnapshot());

test('test overflow not-distribute', () =>
  expect(pkg.formatProduct({}, item, null, null, object2)).toMatchSnapshot());
