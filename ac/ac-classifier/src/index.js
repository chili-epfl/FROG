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
          'https://cdn.pixabay.com/photo/2016/12/04/21/58/rabbit-1882699_960_720.jpg',
          'https://cdn.pixabay.com/photo/2016/11/02/16/02/natural-1792047_960_720.jpg',
          'https://cdn.pixabay.com/photo/2013/05/17/07/12/elephant-111695_960_720.jpg',
          'https://cdn.pixabay.com/photo/2016/02/19/11/35/hong-kong-1209806_960_720.jpg'
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
