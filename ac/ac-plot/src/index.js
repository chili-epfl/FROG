// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner'

const meta = {
  name: 'Plot statistical data',
  shortDesc: 'Allow the student to see various plots of some data',
  description: 'Allow the student to see various plots of data chosen by the teacher or the student',
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
  id: 'ac-plot',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  ActivityRunner,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
