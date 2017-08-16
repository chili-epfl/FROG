// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Images viewer',
  type: 'react-component',
  shortDesc: 'Display images',
  description: 'Dsplay a list of images possibly categorised',
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
      title: 'New image',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            title: 'URL of the image'
          },
          categories: {
            type: 'array',
            title: 'New category',
            items: {
              type: 'string',
              title: 'Category name'
            }
          }
        }
      }
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) =>
  <div>
    {JSON.stringify(activityData)}
  </div>;

export default ({
  id: 'ac-imgView',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
