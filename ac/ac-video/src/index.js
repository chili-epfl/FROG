// @flow

import React from 'react';
import ReactPlayer from 'react-player';
import { type ActivityRunnerT } from 'frog-utils';

import Dashboard from './dashboard';

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
  required: ['url', 'playing', 'loop'],
  properties: {
    url: {
      type: 'string',
      title: 'URL of video'
    },
    playing: {
      type: 'string',
      title: 'Should video begin auto-playing?',
      enum: ['true', 'false']
    },
    loop: {
      type: 'string',
      title: 'Should video loop?',
      enum: ['true', 'false']
    }
  }
};

export const ActivityRunner = ({ activityData, logger }: ActivityRunnerT) =>
  <ReactPlayer
    url={activityData.config.url}
    playing={activityData.config.playing}
    controls
    loop={activityData.config.loop}
    onStart={() => logger({ paused: false, played: 0 })}
    onPause={() => logger({ paused: true })}
    onPlay={() => logger({ paused: false })}
    onEnded={() => logger({ ended: true })}
    onProgress={x => logger({ ...x, ended: false })}
    width="100%"
    height="100%"
  />;

export default {
  id: 'ac-video',
  type: 'react-component',
  ActivityRunner,
  config,
  meta,
  Dashboard
};
