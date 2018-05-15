// @flow

import * as React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './Prez';

const meta = {
  name: 'Presentation activity',
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
    pdf_url: {
      title: 'Full PDF URL',
      type: 'string'
    },
    debug: {
      debug: true,
      type: 'boolean'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  "annotations": [],
  "pageNum": 1,
  "pdf_file": ''
};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};


export default ({
  id: 'ac-prez',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
