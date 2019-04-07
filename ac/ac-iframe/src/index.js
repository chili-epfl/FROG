// @flow

import { uuid } from 'frog-utils';

const meta = {
  name: 'Embedded website',
  shortDesc: 'Embedding an external website in an iFrame',
  description:
    'Takes a URL and displays the corresponding website embedded in an iFrame. Not all websites allow embedding.',
  category: 'Core tools',
  exampleData: [
    {
      title: "Stian's blog",
      config: {
        url: 'http://reganmian.net'
      },
      activityData: {}
    },
    {
      title: 'Piratepad',
      config: {
        url: 'http://piratepad.net/p/{}'
      },
      activityData: {}
    },
    {
      title: 'Jitsi Meeting',
      config: {
        url: 'https://meet.jit.si/{}'
      },
      activityData: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'URL of website (use {} to insert a unique ID per instance)'
    },
    trusted: {
      type: 'boolean',
      title:
        'Trusted site, allow microphone, camera, geolocation, midi, encrypted-media'
    }
  }
};

const dataStructure = {};

const mergeFunction = ({ config: data }: Object, dataFn: *) => {
  if (data.url && data.url.includes('{}')) {
    dataFn.objInsert(uuid(), 'uuid');
  }
};

export default {
  id: 'ac-iframe',
  type: 'react-component',
  configVersion: 1,
  config,
  meta,
  mergeFunction,
  dataStructure
};
