// @flow

import { type ActivityPackageT } from 'frog-utils';
import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'Proximity',
  type: 'react-component',
  shortDesc: 'Manually create group',
  description:
    'Gives the possibility for students to make their own group if followed by the prox operator',
  exampleData: [{ title: 'Case with no data', config: {}, data: {} }]
};

const config = {};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { students: {}, groups: {} };

export default ({
  id: 'ac-prox',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dataStructure
}: ActivityPackageT);
