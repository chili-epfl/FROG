// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import ActivityRunner from './Classifier';

const meta = {
  name: 'Learning Component Classifier',
  type: 'react-component',
  shortDesc: 'Quickly display images to classify',
  description:
    'Show to the student images one after the other and the student has to choose what category is the most appropriated one',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} },
    {
      title: 'Case with data',
      config: {
        title: "Decide if it's a landscape or an animal",
        images: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Wei%C3%9Fr%C3%BCckengeier_Gyps_africanus_HP_L2043.JPG/500px-Wei%C3%9Fr%C3%BCckengeier_Gyps_africanus_HP_L2043.JPG',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/%D0%92_%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BB%D0%B0%D0%BD%D0%B4%D1%88%D0%B0%D1%84%D1%82%D0%BD%D0%BE%D0%BC_%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_panoramio.jpg/1280px-%D0%92_%D0%9C%D0%B8%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%BC_%D0%BB%D0%B0%D0%BD%D0%B4%D1%88%D0%B0%D1%84%D1%82%D0%BD%D0%BE%D0%BC_%D0%BF%D0%B0%D1%80%D0%BA%D0%B5_-_panoramio.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/02-29-11%2C_covered_picnic_table_-_panoramio.jpg/1280px-02-29-11%2C_covered_picnic_table_-_panoramio.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/H._C._Andersens_Lind.JPG/1280px-H._C._Andersens_Lind.JPG'
        ],
        categories: ['landscape', 'animal']
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    images: {
      title: 'Images to display',
      type: 'array',
      items: {
        type: 'string',
        title: 'Image URL'
      }
    },
    categories: {
      title: 'Categories',
      type: 'array',
      items: {
        type: 'string',
        title: 'Category'
      }
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  if (object.config.images) {
    object.config.images.forEach(url => {
      const key = uuid();
      dataFn.objInsert({ url, key }, key);
    });
  }

  if (object.data === null) return;
  const objects = (Array.isArray(object.data)
    ? object.data
    : Object.keys(object.data).map(k => object.data[k])
  ).filter(x => x && x.key);

  objects.forEach(obj => dataFn.objInsert(obj, obj.key));
};

export default ({
  id: 'ac-classifier',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
