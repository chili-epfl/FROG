// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner/ActivityRunner';
import dashboard from './Dashboard';
import {
  config,
  configUI,
  exampleConfig0,
  exampleConfig1,
  exampleConfig2
} from './config';

const meta = {
  // the description when choosing the type of an activity
  name: 'Auto-graded coding',
  type: 'react-component',
  shortDesc: 'Autograded code snippets',
  description:
    'Students upload code wich is tested against teacher-designed tests',
  // examples of config
  exampleData: [exampleConfig0, exampleConfig1, exampleConfig2]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (obj, dataFn) => {
  const template = obj.config.template || 'print "Hello world"';
  dataFn.objInsert(template, 'code');
};

export default ({
  id: 'ac-autocode',
  type: 'react-component',
  meta,
  config,
  configUI,
  ActivityRunner,
  dashboard,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
