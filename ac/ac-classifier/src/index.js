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
const dataStructure = [];

// receives incoming data, and merges it with the reactive data using dataFn.*

export default ({
  id: 'ac-classifier',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure
}: ActivityPackageT);
