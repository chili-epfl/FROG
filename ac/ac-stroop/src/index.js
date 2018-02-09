// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner'
import dashboard from './Dashboard'

const meta = {
  name: 'Stroop Effect',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Example with 5 objects',
      config: {
        guidelines: 'Do that!',
        objects: 'lemons,wood,a tomato,grass,the sky',
        colors: 'yellow,brown,red,green,blue'
      },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    objects: {
      title: 'Comma separated objects',
      type: 'string'
    },
    colors: {
      title: 'Color of previous objects (in same order)',
      type: 'string'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (_) => {};

export default ({
  id: 'ac-stroop',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
