// @flow

import dashboards from './dashboard';

export const meta = {
  name: 'Video player',
  shortDesc: 'Video player',
  description:
    'Video player configurable with URL, and some settings (autoplay etc).',
  exampleData: [
    {
      title: 'Sample video',
      config: {
        url: 'https://www.youtube.com/watch?v=RHq6bEgeZD4',
        playing: true,
        loop: false
      },
      activityData: {}
    }
  ]
};

export const config = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      title: 'URL of video'
    },
    playing: {
      type: 'boolean',
      title: 'Should video begin auto-playing?',
      default: true
    },
    loop: {
      type: 'boolean',
      title: 'Should video loop?'
    }
  }
};

export default {
  id: 'ac-video',
  type: 'react-component',
  config,
  meta,
  dashboards
};
