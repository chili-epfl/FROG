// @flow

// import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

import {config} from './config';
import ActivityRunner from './ActivityRunner_V2';

const meta = {
  name: 'WebRTC',
  shortDesc: 'Video Conference',
  description: 'Video conference using WebRTC peer to peer configuration',
  exampleData: [
    { 
      title: 'Yourself',
      config: { title: 'Talk with yourself', audio: true, video: true }, 
      data: [
        {
          id: 1,
          user: 'me'
        }
      ] 
    },
    { 
      title: 'Two people', 
      config: { title: 'Talk with another', audio: true, video: true }, 
      data: [
        {
          id: 1,
          user: 'me'
        },
        {
          id: 2,
          user: 'also me'
        }
      ] 
    }
  ]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  console.log(object + dataFn) 
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