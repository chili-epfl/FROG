// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import ActivityRunner from './Classifier';
import meta from './meta';

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
      dataFn.objInsert({ url, key, type: 'image' }, key);
    });
  }

  if (!object.data) return;
  if (object.data.length > 0 && typeof object.data[0] === 'string') {
    object.data.forEach(text => {
      if (text.length > 0) {
        const key = uuid();
        dataFn.objInsert({ text, key, type: 'text' }, key);
      }
    });
  }
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
  dataStructure,
  mergeFunction
}: ActivityPackageT);
