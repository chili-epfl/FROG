// @flow

import pkg from '..';

let data = {};

const mF = pkg.mergeFunction || ((x, y) => x && y);

const dataFn = {
  objInsert: (obj, path) => (data[path] = obj)
};

const cleanup = d =>
  Object.values(d).map(x => typeof x === 'object' && x && x.url);

const images = [
  { url: 'image1.png', key: '0' },
  { url: 'image2.png', key: '1' },
  { url: 'image3.png', key: '2' },
  { url: 'image4.png', key: '3' },
  { url: 'image5.png', key: '4' }
];

const object1 = {
  config: {
    title: 'test 1',
    images: [images[0].url, images[1].url, images[2].url],
    categories: ['categ 1', 'categ 2']
  },
  data: {
    img1: images[3],
    img2: images[4]
  }
};

const object2 = {
  config: {
    title: 'test 2',
    images: [images[3].url, images[0].url, images[2].url],
    categories: ['categ 3', 'categ 1']
  },
  data: null
};

const object3 = {
  config: {},
  data: {
    img1: images[4],
    img2: images[1]
  }
};

test('test 1: normal case', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object1, dataFn);
  expect(cleanup(data)).toEqual([
    'image4.png',
    'image5.png',
    'image1.png',
    'image2.png',
    'image3.png'
  ]);
});

test('test 2: case without data', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object2, dataFn);
  expect(cleanup(data)).toEqual(['image4.png', 'image1.png', 'image3.png']);
});

test('test 3: case without config', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object3, dataFn);
  expect(cleanup(data)).toEqual(['image2.png', 'image5.png']);
});
