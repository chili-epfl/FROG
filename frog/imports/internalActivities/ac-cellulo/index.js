// @flow

import { type ActivityPackageT } from 'frog-utils';
import defaultDashboard from './dashboard';
import defaultDashboard2 from './dashboard2';
import RoboManage from './RoboManage';
import Assess from './Assess';
const meta = {
  name: 'Cellulo test activity',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    uniqueId: {
      title: 'Unique ID for use with submitLog',
      type: 'string'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

export default ({
  id: 'ac-cellulo',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboards: {
    RoboMap: defaultDashboard,
    eventchart: defaultDashboard2,
    RoboManag: RoboManage,
    RoboAssess: Assess
  },
  dataStructure
}: ActivityPackageT);
