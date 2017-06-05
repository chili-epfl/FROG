// @flow

import React from 'react';
import ReactPlayer from 'react-player';
import { booleanize, type ActivityRunnerT } from 'frog-utils';

import Dashboard from './dashboard';

export const meta = {
  name: 'Video player',
  type: 'react-component'
};

export const config = {
  type: 'object',
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

export const ActivityRunner = ({ configData, logger }: ActivityRunnerT) =>
  <ReactPlayer
    url={configData.url}
    playing={booleanize(configData.playing)}
    controls
    loop={booleanize(configData.loop)}
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
  ActivityRunner,
  config,
  meta,
  Dashboard
};
