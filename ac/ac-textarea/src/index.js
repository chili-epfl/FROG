// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Text area',
  shortDesc: 'Students can edit new or existing text',
  description: 'Can also show configurable prompt',
  exampleData: [
    {
      title: 'Case with no data',
      config: { title: 'No data' },
      activityData: {}
    },
    {
      title: 'Case with no data',
      config: { title: 'No data' },
      activityData: {}
    }
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

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => (
  <div>{JSON.stringify(activityData)}</div>
);

export default ({
  id: 'ac-textarea',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
