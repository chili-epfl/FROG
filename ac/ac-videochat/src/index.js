// @flow

import { type ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const meta = {
  name: 'VideoChat',
  shortDesc: 'Video Conference',
  description: 'Video conference using WebRTC peer to peer configuration',
  exampleData: [
    {
      title: 'Yourself',
      config: {
        title: 'Talk with yourself',
        sdpConstraints: {
          audio: true,
          video: true
        }
      },
      data: []
    }
  ]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = [];

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  if (object.data) {
    object.data.forEach(x => dataFn.listAppend(x));
  }
};

export default ({
  id: 'ac-videochat',
  type: 'react-component',
  meta,
  config,
  dashboards: {test: dashboard},
  ActivityRunner,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
