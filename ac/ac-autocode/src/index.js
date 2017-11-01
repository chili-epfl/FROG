// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';
import { config, configUI } from './config';

const meta = {
  // the description when choosing the type of an activity
  name: 'Auto-graded coding',
  type: 'react-component',
  shortDesc: 'Autograded code snippets',
  description:
    'Students upload code wich is tested against teacher-designed tests',
  // examples of config
  exampleData: [
    {
      title: 'Case with no data',
      config: {
        title: 'Default title',
        guidelines: 'This is what your code should do: ...',
        multipleTry: true,
        numTry: 5
      },
      data: {}
    }
  ]
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
  configUI,
  ActivityRunner,
  dashboard,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
