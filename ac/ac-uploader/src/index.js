// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'File Uploader',
  type: 'react-component',
  shortDesc: 'File Uploader',
  description: 'Allow any student to upload files in the database',
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
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

export default ({
  id: 'ac-uploader',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
