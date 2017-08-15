// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './imgClassifier';

const meta = {
  name: 'Image Classifier',
  type: 'react-component',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
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
  dataFn.objInsert(0, 'index');
};

export default ({
  id: 'ac-imgClass',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
