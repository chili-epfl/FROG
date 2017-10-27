// @flow

import pkg from '..';

let data = {};

const mF = pkg.mergeFunction ? pkg.mergeFunction : (x, y) => x && y;

const dataFn = {
  objInsert: (obj, path) => (data[path] = obj)
};

const images = [
  { url: 'image1.png', categories: ['categ1', 'categ2'] },
  { url: 'image2.png', categories: ['categ2'] },
  { url: 'image3.png' },
  { url: 'image4.png', categories: ['categ3', 'categ1'] },
  { url: 'image5.png', category: 'categ1' }
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

const object2wodata = {
  config: {
    title: 'test 1',
    images: [images[3].url, images[0].url, images[2].url],
    categories: ['categ 3', 'categ 1']
  },
  data: null
};

const object3woconfig = {
  config: {},
  data: {
    img1: images[4],
    img2: images[1]
  }
};

test('test 1: normal case', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object1, dataFn);
  expect(data).toEqual({
    '0': { url: 'image1.png', category: '' },
    '1': { url: 'image2.png', category: '' },
    '2': { url: 'image3.png', category: '' },
    '3': { url: 'image4.png', category: '' },
    '4': { url: 'image5.png', category: '' },
    index: 0
  });
});

test('test 2: case without data', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object2wodata, dataFn);
  expect(data).toEqual({
    '0': { url: 'image4.png', category: '' },
    '1': { url: 'image1.png', category: '' },
    '2': { url: 'image3.png', category: '' },
    index: 0
  });
});

test('test 3: case without config', () => {
  data = pkg.dataStructure ? JSON.parse(JSON.stringify(pkg.dataStructure)) : {};
  mF(object3woconfig, dataFn);
  expect(data).toEqual({
    '0': { url: 'image5.png', category: '' },
    '1': { url: 'image2.png', category: '' },
    index: 0
  });
});
