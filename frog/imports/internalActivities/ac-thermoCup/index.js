// @flow

import { type ActivityPackageT } from '/imports/frog-utils';

const meta = {
  name: 'Simulate thermo cup',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  category: 'Simulations',
  exampleData: [
    {
      title: 'Styrofoam, warm, cold',
      config: {},
      data: {
        air_initial_temperature: 5,
        liquid_initial_temperature: undefined,
        material0: 'Styrofoam',
        material0_initial_temperature: 25,
        'thermometer0-temperature': '35.3',
        'thermometer1-temperature': '5.0',
        ticks: 180
      }
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    screenshot: {
      title: 'Enable screenshot',
      type: 'boolean'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert(object);
};

export default ({
  id: 'ac-thermoCup',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
