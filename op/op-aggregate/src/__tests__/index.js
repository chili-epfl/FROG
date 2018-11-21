import op from '../operatorRunner';
import object from '../__fixtures__/object.js';
import sumObject from '../__fixtures__/objectScore.js';

test('Aggregate unique', () =>
  expect(op({ unique: true }, object)).toMatchSnapshot({}));

test('Aggregate unique 2', () =>
  expect(op({ unique: true }, sumObject)).toMatchSnapshot({}));

test('Aggregate unique count', () =>
  expect(op({ unique: true, countScore: true }, object)).toMatchSnapshot({}));

test('Aggregate unique count 2', () =>
  expect(op({ unique: true, countScore: true }, sumObject)).toMatchSnapshot(
    {}
  ));

test('Aggregate unique sum', () =>
  expect(op({ unique: true, sumScore: true }, object)).toMatchSnapshot({}));

test('Aggregate unique sum 2', () =>
  expect(op({ unique: true, sumScore: true }, sumObject)).toMatchSnapshot({}));

test('Aggregate', () => expect(op({}, sumObject)).toMatchSnapshot({}));

test('Aggregate top 2', () =>
  expect(op({ topN: 2, chooseTop: true }, sumObject)).toMatchSnapshot({}));
