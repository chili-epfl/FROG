// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';
import { config, exampleConfig } from './config';

const meta = {
  // the description when choosing the type of an activity
  name: 'Auto-graded coding',
  type: 'react-component',
  shortDesc: 'Autograded code snippets',
  description:
    'Students upload code wich is tested against teacher-designed tests',
  // examples of config
  exampleData: [exampleConfig]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = () => {};

export default ({
  id: 'ac-autocode',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dashboard,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
