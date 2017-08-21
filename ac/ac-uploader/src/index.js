// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Uploader',
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
  id: 'ac-uploader',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
