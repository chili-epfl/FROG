// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboard';
import {
  config,
  configUI,
  validateConfig,
  exampleConfig0,
  exampleConfig1,
  exampleConfig2,
  exampleConfig3
} from './config';

const meta = {
  // the description when choosing the type of an activity
  name: 'Auto-graded coding',
  shortName: 'Coding',
  type: 'react-component',
  shortDesc: 'Autograded code snippets',
  description:
    'Students upload code which is tested against teacher-designed tests',
  // examples of config
  exampleData: [exampleConfig0, exampleConfig1, exampleConfig2, exampleConfig3]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (obj, dataFn) => {
  const template = obj.config.template || '"Write your code here"';
  dataFn.objInsert(template, 'code');
};

export default ({
  id: 'ac-autocode',
  type: 'react-component',
  meta,
  config,
  configUI,
  validateConfig,
  ActivityRunner,
  dashboards,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
