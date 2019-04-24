// @flow

import { type ActivityPackageT, ProgressDashboard } from 'frog-utils';

const meta = {
  name: 'Learn the rule of SET',
  shortDesc: 'Example of inductive learning',
  description:
    'Example of inductive learning. Discover the rule of SET by looking at examples',
  category: 'Discipline-specific',
  exampleData: []
};

const config = {
  type: 'object',
  properties: {}
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = () => {};

export default ({
  id: 'ac-set',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards: { progress: ProgressDashboard },
  dataStructure,
  mergeFunction
}: ActivityPackageT);
