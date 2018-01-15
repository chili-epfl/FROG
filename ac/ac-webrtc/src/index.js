// @flow

import { type ActivityPackageT } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';

const meta = {
  name: 'WebRTC',
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
  id: 'ac-webrtc',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
