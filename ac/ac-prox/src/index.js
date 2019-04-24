// @flow

import { type ActivityPackageT } from 'frog-utils';
import dashboards from './dashboard.js';

const meta = {
  name: 'Proximity',
  type: 'react-component',
  shortDesc: 'Manually create group',
  description:
    'Gives the possibility for students to make their own group if followed by the prox operator',
  category: 'Core tools'
};

const config = {
  type: 'object',
  properties: {
    largeClass: { title: 'Support very large class', type: 'boolean' }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { students: {}, groups: {}, studentInfo: {} };

export default ({
  id: 'ac-prox',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards,
  dataStructure
}: ActivityPackageT);
