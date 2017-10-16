import { inMemoryReactive } from 'frog-utils';

import pkg from '..';

Math.random = jest.fn(() => 0.5);

const emptyData = { data: [], config: {} };
const boxes = [
  { title: 'hello', content: 'hi', id: 'a' },
  { title: 'Howdy', content: 'wassap', id: 'b' }
];
const contentData = { data: boxes, config: {} };

test('Merge data with no input is OK', () =>
  inMemoryReactive(pkg.dataStructure || {}).then(({ data, dataFn }) => {
    pkg.mergeFunction(emptyData, dataFn);
    expect(data.data).toEqual([]);
  }));

test('Merge data with two boxes is OK', () =>
  inMemoryReactive(pkg.dataStructure || {}).then(({ data, dataFn }) => {
    pkg.mergeFunction(contentData, dataFn);
    expect(data.data).toEqual([
      { content: 'hi', id: 'a', title: 'hello', x: 400, y: -400 },
      { content: 'wassap', id: 'b', title: 'Howdy', x: 400, y: -400 }
    ]);
  }));

const configData = { config: { boxes }, data: [] };

test('Merge no data with boxes in config', () =>
  inMemoryReactive(pkg.dataStructure || {}).then(({ data, dataFn }) => {
    pkg.mergeFunction(configData, dataFn);
    expect(data.data).toEqual([
      { content: 'hi', id: 'a', title: 'hello', x: 400, y: -400 },
      { content: 'wassap', id: 'b', title: 'Howdy', x: 400, y: -400 }
    ]);
  }));

const bothData = {
  config: { boxes },
  data: [{ content: 'leman', title: 'geneve', id: 'd' }]
};
test('Merge data with boxes in config', () =>
  inMemoryReactive(pkg.dataStructure || {}).then(({ data, dataFn }) => {
    pkg.mergeFunction(bothData, dataFn);
    expect(data.data).toEqual([
      { content: 'hi', id: 'a', title: 'hello', x: 400, y: -400 },
      { content: 'wassap', id: 'b', title: 'Howdy', x: 400, y: -400 },
      { content: 'leman', id: 'd', title: 'geneve', x: 400, y: -400 }
    ]);
  }));
