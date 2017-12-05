// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import { config } from './config';
import { testData } from './testData';

const meta = {
  name: 'CK Student View',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
      { title: 'CK-Student with no data', config: { config }, data: []   },
    { title: 'Case with with data', config: { config }, data: [ testData ] }
  ]
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
  id: 'ac-ck-student',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
