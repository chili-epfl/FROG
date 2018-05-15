// @flow

import { type ActivityPackageT } from 'frog-utils';

import { config, configUI } from './config';

import ActivityRunner from './ActivityRunner';
import dashboards from './Dashboard';

const meta = {
  name: 'VideoChat',
  shortDesc: 'Video Conference',
  description: 'Video conference using WebRTC peer to peer configuration',
  exampleData: [
    {
      title: 'Yourself',
      config: {
        title: 'Talk with yourself',
        userMediaConstraints: {
          audio: true,
          video: true
        },
        activityType: {
          many2many: true,
          one2many: false
        }
      },
      data: []
    }
  ]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = [];

export default ({
  id: 'ac-videochat',
  type: 'react-component',
  meta,
  config,
  configUI,
  dashboards,
  ActivityRunner,
  dataStructure
}: ActivityPackageT);
