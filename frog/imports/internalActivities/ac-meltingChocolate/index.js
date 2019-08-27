// @flow

import { type ActivityPackageT } from '/imports/frog-utils';

const meta = {
  name: 'Melting chocolate simulation',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  category: 'Simulations'
};

const config = {
  type: 'object',
  properties: {
    mode: {
      title: 'Mode',
      type: 'string',
      enum: ['heating', 'cooling']
    },
    screenshot: { title: 'Enable screenshot', type: 'boolean' }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert(object);
};

export default ({
  id: 'ac-meltingChocolate',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
